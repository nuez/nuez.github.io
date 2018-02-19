---
author: "Teun van Veggel"
date: 2017-10-01
title: "Create computed fields in Drupal 8."
weight: 10
description: "Drupal allows you to compute your fields instead of fetching them from the database. How easy is that and how well does it integrate with other modules?"
---

In Drupal 8 we can distinguish between field types that have some computed **properties** and on the other hand fields that are fully computed.

The former is quite common in Drupal 8: several field type definitions have computed properties alongside other properties that are stored in the database. For example the ```TextItem``` field type stores the ```value``` and the ```format``` in the database, but a third property ```processed``` is computed on the fly: it parses the raw text *value* using a *format* resulting in the *processed* value. Another example is the ```entity``` property on the EntityReferenceItem field type, which 'computes' the full entity based on the ```target_id``` property that is saved to the database.

creating field definitions based on existing field types that don't store data to the database but are entirely computed. The only example of this in core that I have been able to find is the ```moderation_state``` field in the *Content Moderation* module in core.

## So how does it work?

Let's see an example. Let's say we want to add the field ```my_computed_field``` to all nodes that returns a random list of strings. 

First we need to add a base class and set the ```setComputed()``` and ```setClass``` setters. The field is computed so we don't need it on the node form, but we do need it to show on the node view settings in order to change the display settings. For that we use the ```->setDisplayOptions()``` and ```->setDisplayConfigurable``` setters.


```php
/**
 * Implements hook_entity_base_field_info_alter().
 */
function your_module_entity_base_field_info_alter(&$fields, EntityTypeInterface $entity_type) {
  if ($entity_type->id() === "node") {
    $fields['my_computed_field'] = BaseFieldDefinition::create('string')
      ->setName('my_computed_field')
      ->setLabel(t('My computed field'))
      ->setComputed(TRUE)
      ->setTargetEntityTypeId('node')
      ->setClass(ComputedField::class)
      ->setDisplayOptions('view', [
        'type' => 'string',
        'weight' => 0,
      ])
      ->setDisplayConfigurable('view', TRUE);
  }
}
```
 

In Drupal 8 all fields are *lists* of field items, even if they only contain one item (cardinality of one).  The ```FieldItemList```class takes care of instantiating each field item with the value that was fetched from the database. It then puts the field items in the *list* class variable. 

The two methods that are - eventually - responsible for instantiating those field items and putting them in the ```list``` class variable are the ```->get()``` and ```->getIterator()``` methods. Once the field items are already in the *list* class variable, they will not be instantiated again. So to make the computed class work we only need to make sure that we instantiate fields and add them to *list*, before the parent methods have the chance to do so.

```
class ComputedField extends FieldItemList implements FieldItemListInterface {

  /**
   * {@inheritdoc}
   */
  public function get($index) {
    $this->setComputedValues();
    return isset($this->list[$index]) ? parent::get($index) : NULL;
  }

  /**
   * {@inheritdoc}
   */
  public function getIterator() {
    $this->setComputedValues();
    return parent::getIterator();
  }

  /**
   * Compute the values.
   */
  protected function computeValues(){
    $some_calculated_values = [1,2,3];
    foreach($some_calculated_values as $delta => $value){
      $this->list[$delta] = $this->createItem($delta, $value);
    }
  }
  
}
```
This class eventually needs to take various things into account: it needs to overwriting two methods and instantiating field items. Ideally you would only have one simple method to implement: one that returns an array of computed values. That's why in https://www.drupal.org/node/2392845 there is a patch pending approval that adds a base class that does the heavy lifting for you. It also includes field validation based on the field type.


## Compatibility with other modules

The nice thing about computed entity properties in Drupal 7 was that your computed properties were automatically picked up by different contrib modules: Views would automatically 'see' your computed field. Also search API was able to index computed fields. What's the status of this in Drupal 8?

### Views
In Drupal 8, we're almost at the same level: Views in Drupal 8.4 supports computed fields and will allow them to be rendered as a field. It's not as magic (yet) as Drupal 7: we still need to declare our computed field in ```hook_views_data_alter``` in order to be picked up by Views:

```
/**
 * Implements hook_views_data_alter().
 */
function your_module_views_data_alter(array &$data) {
  $data['node']['my_computed_field'] = [
    'title' => t('My computed field'),
    'field' => [
      'id' => 'field',
      'default_formatter' => 'string',
      'field_name' => 'my_computed_field',
    ],
  ];
}
```
Since Views is technically a visual query builder, and our computed field is not stored to the database, it doesn't allow you to use a computed field for sorting and limiting the view.

### Search API
Search API does work with computed fields out of the box. Yeah!

### Rest in core and contrib.
Rest in core works with computed fields out of the box. Yeah!

However I've also tried JsonAPI and that still needs some work: see issue https://www.drupal.org/node/2912116.

## Caveats
It's currently not really possible to add computed fields in code for specific bundles only. There is a ```hook_entity_bundle_field_info``` hook, which is due to become deprecated when https://www.drupal.org/node/2346347 is finished. Adding the computed field definition here should be possible according to hook documentation, however seems to throw exceptions.

## Conclusion
Computed fields widely used nor documented very clearly yet, but it's there, mostly working, and will have many use cases for example when using Drupal as an API or SAAS.