---
author: "Teun van Veggel"
date: 2017-10-01
title: "Create computed fields in Drupal 8."
weight: 10
---

*I have updated this post as a result of [this](https://www.drupal.org/project/drupal/issues/2392845) issue, that added the  ```ComputedItemListTrait``` trait to core.*

In Drupal 8 we have, on the one hand, field types that have some computed **field properties**, and on the other hand fields that are fully computed.

The former is quite common in Drupal 8: for example the ```TextItem``` field type stores the ```value``` and the ```format``` property in the database, but a third property called ```processed``` is computed on the fly. 

When it comes to fully computed field items, there are less examples in core. It seems that in Drupal 8.5 the only fully computed field (using an existing field type) is the ```moderation_state``` field that the Content Moderation module adds to entities with a moderation workflow. 

Since the ```ComputedItemListTrait``` was added in [this issue](https://www.drupal.org/project/drupal/issues/2392845), however, it has become quite straightforward to create a fully computed field.  

<!--more-->

## So how does it work?

To compute the values of a specific field, all you need to do is mark the ```setComputed``` flag and set the *class* in charge of computing the value in the field definition:

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
After that, you create a class that extends the ```FieldItemList``` class and uses the ```ComputedItemListTrait```. Because of the trait, you will be forced to implement the abstract method ```computeValue```, which will be in charge of actually setting the computed value.

```
class ComputedField extends FieldItemList implements FieldItemListInterface {

  use ComputedItemListTrait;
  
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
Your method should set the list property (which is always an array of values), with one or more instantiated field items.

The ```ComputedItemListTrait``` under the hood will then make sure that the computed  values are computed and stored in the list property before talking to the database.

## Integration with the rest of Drupal

In Drupal 7, the advantage of using computed fields was that computed fields can be immediately used in Views. Not as sorts or filters (you can't add computed fields to the database query), but as selectable fields that you can add to, say, a table.

In Drupal 8, at least as far as I've been able to find out, you will still need to declare your computed field in a ```hook_views_data()```hook to make it a work.

Another really big advantage of computed fields in Drupal 7 was, that the computed values were automatically picked up by Search API, allowing you to add, for example, computed results in your facet search. The good news is that also in Drupal 8, the Search API works with computed fields out of the box!