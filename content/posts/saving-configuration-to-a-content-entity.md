---
author: "Teun van Veggel"
date: 2018-05-25
title: "Saving Configuration to a content entity."
weight: 12
tags: ["Drupal"]
---

In one of my projects I found myself needing to save configuration (coming from a plugin) to **content entities**. In Drupal however, configuration is saved to **configuration entities** (or **configuration objects**).

If Drupal provides solid solutions for configuration, maybe **the problem I was trying to solve was an ***[http://xyproblem.info/](XY problem)***? (Was I trying to find the answer to the wrong question?) Even the [documentation on configuration management](https://www.drupal.org/docs/8/configuration-management) suggested content had nothing to do with configuration:

> Configuration is the collection of admin settings that determine how the site functions, **as opposed to the content of the site.**

However, I discovered that several contrib modules have come across the same need to **save configuration to** ***content entities*** and have solved this problem in different ways.

Many modules have custom field types saving some sort of configuration, like the [Views Reference](https://www.drupal.org/project/viewsreference) module that saves configuration linked to a specific View to a ```string``` property belonging to field type made for the purpose. Some modules actually have generic solutions that one could easily integrate in their own module: the [Plugin](https://www.drupal.org/project/plugin) module and [Commerce](https://www.drupal.org/project/commerce) come up with an agnostic field type for saving plugin configuration of any type.

In this post I will try to explain the use case with an example module.

<!--more-->

### But why?

Before I dive in to the specifics, you might still not be convinced of the validity of my problem: So let's look at the difference between *Content* and *Config* entities in Drupal: 

|Config Entity|Content Entity|
|----------|---------|
|Limited by design|Unlimited by design|
|No fields|Fields|
|Created by developer/site builder|Created by editor/end user|

So if you need editors to create and save items of configuration in unlimited amounts, not the **Config Entity** but the **Content Entity** might be the way to go.

### The Plugin Field Type

The [Plugin](https://www.drupal.org/project/plugin) and [Commerce](https://www.drupal.org/project/commerce) modules both implement an almost identical way of saving configuration to content entities: they both provide a new *field type* for saving plugin Configuration and use 'derivatives' for the specific Plugin types to use for each field <sup id="a1">[1](#f1)</sup>.

To illustrate this, I've created a module called ['Shapes'](https://github.com/nuez/shapes) which is using the 'Commerce' module (but could just as easily have used the Plugin module). A user with the right permissions will be allowed to create new 'Shape' entities (as many as he or she likes). The eligible shapes are plugins of type 'Shape' and the currently available shapes are: circle, ellipse, rectangle and star. Any new shape would just be a matter of adding the Plugin for that particular shape.

Each 'shape' plugin instance requires configuration. In case of the circle it's a 'radius', in case of the ellipse it's the 'X radius' and the 'Y radius', in case of the rectangle it's the 'height' and the 'width' and in case of the Star it's the 'inner radius', 'outer radius' and the 'amount of points'. As you can see the configuration for each of these shapes could be quite arbitrary.

In order to save the configuration we have to add a field of type ```commerce_plugin_item``` to a content entity. Note that  behind the colon you find the derivative of the field type for our 'Shape' plugin type.

```
    $fields['shape'] = BaseFieldDefinition::create('commerce_plugin_item:shape')
      ->setLabel(t('Shape'))
      ->setDisplayConfigurable('view', TRUE)
      ->setDisplayConfigurable('form', TRUE);
```

By implementing the ```ConfigurablePluginInterface``` and the ```PluginFormInterface``` which are also required for any 'regular' configurable plugin (such as Image effects, Blocks etc), you are required to implement the methods needed for the form element of the configuration.

The 'PluginSelectWidget' provided by Commerce will automatically render the correct plugin configuration form using ajax, depending on the plugin selected. 

<img src="/images/shapes.gif" alt="Screenshot GIF Shapes module"/>


You can try it out downloading the repo from: https://github.com/nuez/shapes

### Food for thought

To achieve this without writing too much custom code, you need either the Plugin or the Commerce module, both with their significant overhead. Specially the Commerce module you don't want to install just to be able to save configuration to a field.

Would it be worth it to have a dedicated module just for this purpose?

A part from that, the field type provided by either module doesn't take into account the schema validation that occurs with regular configuration, that would also help with the translation of this type of field as it does with translating regular configuration entities.

----

<a id="f1" href="#a1"><strong>1.</strong></a> The only difference between Commerce and Plugin is the way they decide which Plugin types are eligible for the 'Plugin field'. Commerce uses an Event Subscriber to which new Plugin Types can Subscribe. The Plugin module adds a Plugin Type Manager that relies on YAML definitions of the different Plugin Types, something that's currently not provided by Drupal Core. [↩](#a1)