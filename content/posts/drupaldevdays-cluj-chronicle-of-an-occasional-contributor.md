---
author: "Teun van Veggel"
date: 2019-06-15
title: "Fixing is good. Failing is better. Chronicle of an occasional contributor."
weight: 13
description: Last week I attended the Drupal Dev Days in Cluj Napoca, Romania. I decided not to go to any talks but to join the 'Media' team for Drupal core and work on bug fixes. Here's what I learned.

tags: ["Drupal"]
---

Last week I attended the Drupal Dev Days in Cluj Napoca, Romania. I decided not to go to any talks but to join the 'Media' team for Drupal core and work on bug fixes. Here's what I learned.

<!--more-->

## Testbot is king

For every patch in the Drupal issue queue, the testbot runs all the **26.458(!)** tests that are in core at the time of writing. By doing so, Drupal tries to ensure that stuff will keep working after new things are added and bugs are fixed. 

It takes about an hour or so to run all the tests depending on how busy the test bot is at that moment.
 
**That. is. blazingly. fast.**
 
Many of the tests require a full Drupal installation before they can be executed. On my local machine these *functional tests* take about one minute or so on average, so running all the tests on my local machine (which I'm not going to try) would probably take about a week.
 
## Fixing is good. Failing is better.

I learned that running tests on Drupal.org is not only about making things work, but also about making things fail. Many things in Drupal tie together in many ways and all the stakeholders involved need to revise and approve even the simplest of patches. Writing a 'fail test' patch that proves that there is a bug in the first place helps everyone to understand what's going on.

Another reason you want the testbot to fail, is to get an idea of the impact of the solution you're proposing. It's tempting to fix things on the surface, the quick hack, and by doing so you're unlikely to break a lot of things. However, to keep Drupal stable and manageable, things need to be solved in the right abstraction layer, and the deeper you go, the more likely it is to break things. The quickest way to find out is to let the testbot do it's job and report back.

## Bureaucracy is a necessary evil.

It can be frustrating to propose a fix as an occasional contributor and then not see it being committed in years (It has been known to happen). How often do we read comments in the issue queue like *'Why is this still not fixed / committed?'*. I can totally understand why people say this, and I have probably said something similar too at some point.

After spending a week with the Media team of Drupal Core I now better understand why these things take so long and what makes it so hard to get things done.

I won't bore you with the [details](https://www.drupal.org/contribute/core/maintainers) of how Drupal is governed, but in a nutshell, as with anything in life, it's all about **convincing the right people**. In Drupal core there are people that build stuff and people that commit stuff. The [12 core committers](https://api.drupal.org/api/drupal/core%21MAINTAINERS.txt/8.8.x) that Drupal currently has, have to make sure that Drupal remains stable, future proof and backwards compatible. That's an incredibly hard job, considering the sheer complexity of Drupal, so naturally core committers are incredibly hard to convince of basically anything. If *core committers* are hard to convince, and it is *core contributors* who need to convince them, it's only logical that it's equally hard to convince *them* as well.

Unfortunately, there is only so much convincing one can do with nice code and test coverage. Core committers and contributors are humans (for now at least), and like with everything, you're more likely to walk the extra mile for people you know personally and that are nice. So the bureaucracy of knowing people and making contacts definitely helps to get things committed and get things done.

Fortunately, what I found, is that in the Drupal Community there is no correlation between 'hard to convince' and 'hard to approach'. Every single person I have met, regardless of their role in Drupal, has been incredibly hard to convince, but at the same time incredibly easy to approach and incredibly helpful. I walked in with a healthy level of Imposter syndrome and will admit that there were conversations that went beyond my level of understanding, but I was able to get a word in edgeways and convince people myself.

Without events like the Drupal Dev Days it's a lot harder to get to know people, and therefore to get things done, so a big thanks to organisers of this edition in Cluj-Napoca and see you next year in Belgium!