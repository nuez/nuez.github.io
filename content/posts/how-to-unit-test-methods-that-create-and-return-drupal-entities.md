---
author: "Teun van Veggel"
date: 2018-03-08
title: "How to unit test methods that create and return entities in Drupal."
weight: 10
---

Recently I tried to create a Unit test for a class (Drupal service) that creates and returns content entities, say called ```Foo```. **In my unit test, all I wanted to do is check if my class method (my *Subject Under Test*) generates the right amount of ```Foo``` entities and if those ```Foo``` entities hold the field values I expect.**


My unit test will execute the method, and therefore create Foo, using the static ```Foo::create()``` method. ```::create()``` will fire up different dependenencies entities I need loads of dependencies. Then and the method will fire , as I would have to mock and stub my way through all the services that it relies on to fetch those values. More useful would be to mock the entity and let the  ```::create()``` method return the values that were just passed as arguments.

**¿Does that make any sense?**

Let me try and explain:

<!--more-->

Say you have a service that creates a bunch of entities, like:

```php

class MyService{

  /**
   * @return Foo[]
   **/
  public function createFoos(){

    $data = [
      'one',
      'two',
      'three'
    ];

    $foos = [];

    foreach($data as $value){

      $foos[] = Foo::create([
        'custom_field' => $value,
      ]);

    }

    return $foos;
  }
}
```

Say you have a test that looks like this:

```php

class MyServiceTest extends UnitTestCase{

  /**
   * @var \MyService
   */
  protected $sut; // Subject under test.

  /**
   * Setting up the test.
   */
  public function setUp(){
    $this->sut = new MyService();
  }

  /**
   * Test ::createFoos()
   */
  public function testCreateFoos(){

    $expected = ['one', 'two', 'tree'];

    $result = $this->sut->createFoos();

    $this->assertEquals($expected, $result);
  }

}

```

In this case the test would break for two reasons. One, because the Service Container doesn't exist. OK, I'll have to do something about that.

Two, because ```$this->sut->createFoos()``` returns ```Foo[]```, while I'm checking for values of type ```string[]```. As I said, having to pull the data from my ```Foo``` entities and convert them to ```string[]``` would probably mean a whole lot more of stubbing, mocking, and breakpointing my way through the code. Instead, it would be a lot easier to let ```Foo::create($values)``` just return the ```$values``` I just put in.

Since ```Foo::create()``` is a static method (and testing and static methods don't go well together), It's important to realise that ```Foo::create()``` is in fact calling the instance method of the 'Foo' Entity Storage, see Entity.php:

```
public static function create(array $values = []) {
  $entity_manager = \Drupal::entityManager();
  return $entity_manager->getStorage($entity_manager->getEntityTypeFromClass(get_called_class()))->create($values);
}
```

So what we want is to let ```$entity_manager->create($values)``` to return the ```$values``` that were just put in as arguments. With Prophesy that's quite easy to do:


```
$entity_storage = $this->prophesize(EntityStorageInterface::class);

$entity_storage->create(Argument::any())->will(function($args, $mock){
  return $args;
}

```

After that, the mocked $entity_storage goes into the mocked entity manager, which will go into a brand new Drupal Container.

The complete test would look like this.

```
class MyServiceTest extends UnitTestCase{

  /**
   * @var \MyService
   */
  protected $sut; // Subject under test.

  /**
   * Setting up the test.
   */
  public function setUp(){

    // My subject under test.
    $this->sut = new MyService();

    // Mocking the services.
    $entity_manager = $this->prophesize(EntityManagerInterface::class);
    $entity_storage =  $this->prophesize(EntityStorageInterface::class);

    // Doing some magic.
    $entity_storage->create(Argument::any())->will(function($args, $mock){
      return $args;
    }

    $entity_manager->getStorage('foo')->willReturn($entity_storage);
    $entity_manager->getEntityTypeFromClass(Foo::class)->willReturn('foo');

    // Putting the mocked services in the Drupal service container.
    $container = new ContainerBuilder();
    $container->set('entity.manager', $entity_manager->reveal());
    \Drupal::setContainer($container);
  }

  /**
   * Test ::createFoos()
   */
  public function testCreateFoos(){

    $expected = ['one', 'two', 'tree'];

    $result = $this->sut->createFoos();

    $this->assertEquals($expected, $result);
  }

}

```

I hope this makes sense and that it's helpful for those who are trying to unit test methods that return Drupal entities.

Suggestions are very welcome.
