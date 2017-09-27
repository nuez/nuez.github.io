---
title: "DrupalCamp Spain"
description: "The DrupalCamp Spain Website (2017 - Madrid) is also a case study for Drupal 8 best practices, configuration management and deployment workflows."
image: "drupalcamp.svg"
background: "drupalcamp_bg.png"
tags: ["Drupal 8", "Jenkins", "Drupal-composer", "Best practices"]
weight: -1
draft: false
---

- https://2017.drupalcamp.es
- https://github.com/AsociacionDrupalES/DrupalCampSpain
- https://www.lullabot.com/articles/a-successful-drupal-8-deployment

We developed the the DrupalCamp Spain website not only as a point of information for the DrupalCamp Spain 2017,but also as a blue print for future Drupal Camps and a case study for Best practices in Drupal 8. The code base is publicly accessible on <a href="https://github.com/AsociacionDrupalES/DrupalCampSpain" target="_blank">Github</a>

The website is branched off the <a href="https://github.com/drupal-composer/drupal-project" target="_blank">Drupal Composer</a> project, meaning that all dependencies can be installed using Composer (including contributed modules and core), keeping the GIT repository for the project itself clean and tidy. For deployment we used a 'one button' deployment workflow using Jenkins, Ansible and Ansistrano. (For more information about that see https://www.lullabot.com/articles/a-successful-drupal-8-deployment).

For theming we used Libsass for blazing fast CSS compiling and we followed SMACSS to create a modular and scalable theming layer for both individual - custom designed - landing pages as well as the rest of the website. Instead of building the ticketing and attendee tracking ourselves, we made use of the EventBrite API.

During the development we followed the gitflow workflow, meaning that changes and new functionality was proposed and merged using separate branches.