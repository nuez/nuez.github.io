---
author: "Teun van Veggel"
date: 2017-08-01
title: "Hugo vs Drupal: Why I used Hugo for my Drupal portfolio website."
weight: 10
---

<a href="https://www.drupal.org">Drupal</a> is a full-fledged CMS for secure and complex websites and applications and is adopted by many big companies and governments accross the globe. <a href="https://www.gohugo.io" target="_blank">Hugo</a> is a static site generator built in GoLang that is blazing fast and quickly gaining popularity. For this website about my Drupal work I decided to go for Hugo. Here's why.

<!--more-->

When I started building my new portfolio website, I decided to look further than Drupal to build it. I knew I was going to be the only developer building it and the only editor using it. I didn't need different users, content moderation or multilingual features. It felt like Drupal was going to be too much of distraction from what I wanted: I simple portfolio website that I could easily add content to and tweak the look and feel of.

## Comparing apples and oranges.

I'll admit, comparing Hugo and Drupal is like comparing apples and oranges. One is a CMS, the other a static site generator. One uses a database, the other doesn't. But there are more similarities than meet the eye. To a certain extend, you can build similar things with both: both can be used to build multilingual websites with taxonomies, lists (or views), pagination, content types and view modes.
 
The biggest difference is however the way both turn code and content into the HTML that your browser can understand and display.

### How does Hugo work compared to Drupal?

Hugo, or any other **static** site generator, compiles the necessary HTML+CSS+JS beforehand, probably on your own local machine, after which you push the result to the server. When you request a specific url of your website, say teunvanveggel.nl/posts, then the server literally returns that requested HTML file without having to do anything else. 

With Drupal, or any other server-side framework or CMS, you don't request the HTML file directly: instead you ask the server to perform a series of tasks (fetch the content from the database, process it, perform access checks on it etc.) that eventually leads to the generation of the HTML,CSS and JS the browser will render.

You can imagine that no matter how many caches you enable on Drupal, nothing will be faster than just returning static HTML.

### How do you edit and create content?
 
With Hugo you can create your content on your local machine using any text or code editor; no need to login to any website. The articles you write go in text files organised in folders and are typically written in **MarkDown**, a widely used - super simple - *MarkUp* language. Hugo will collect the articles in the different folders to generate the menus, summary lists and taxonomy pages and turn them into static HTML pages.

To compile to static HTML pages you need to download and execute *Hugo*. Because Hugo is built in Go, it is available as a precompiled binary and it will run on any OS, without having to install any dependency (which is the case of many other static site generators like *Jekyll*). If you run Hugo as a server, you can see your website locally in your browser: it works with LiveReload so you will see the your changes immediately in the browser, code or content, without having to refresh. The development workflow couldn't be smoother.

Thanks to Go, compiling takes a blink of an eye, typically far less time than clicking on the save button in Drupal. This very site for example compiles in between 20 and 40 milliseconds. According to <a href="https://www.youtube.com/watch?v=CdiDYZ51a2o" target="_blank">this</a> youtube video<sup>1</sup> though, 5000 pages of content will take about 6 seconds.

With Drupal everything happens 'server-side', the advantage being that you can edit and write content in any browser from any device as long as your logged in to the website. It offers a great editing experience with the built in WYSIWYG editor that even allows you edit content directly in the presentation layer.

### How difficult is Hugo compared to Drupal?

It probably takes a day to learn Hugo and maybe a week to master it fully: it took me a couple of days to built and design this very website without any prior knowledge of Hugo whatsoever. Hugo is very straightforward and quick to learn compared to Drupal.

Being straightforward and simple though is only possible because Hugo does a certain thing and it does it well. It makes assumptions, is opinionated and magic: to tweak or hook into Hugo won't be easy, if not impossible. 
 
Drupal on the other hand is very powerful, flexible and even coherent, considering it's sheer size. To make everything fit together nicely, Drupal cannot make assumptions nor be opinionated: instead it relies on design patterns and abstraction layers; it takes months if not years to fully understand those basic building stones, meaning that building even the simplest of things can be quite a chore.

When it comes to the front-end, like Drupal, Hugo works with themes that go in a 'themes' folder. The Go templating engine used by Hugo is actually pretty similar to TWIG engine Drupal uses; it has a similar syntax and way of handling template partials. (As do a lot of modern templating engines do.)

For this website I used Hugo with LibSass and a Gulp asset pipeline to compile to CSS. This meant that for development I had both ```gulp``` and ```hugo server``` running during development and writing articles; All the changes I made whether in styling or content, where reflected immediately in my browser.

### Deploying and hosting

This very website is hosted (for free) on <a href="https://pages.github.io" target="_blank">Github Pages</a> and all it takes to deploy is run ```hugo``` on my local machine, commit the changes and push everything to github. You can run hugo yourself to compile or use a service that has Hugo and runs it ever so often, like <a href="https://about.gitlab.com/" target="_blank">GitLab</a>. In that case you literally only have to push your code changes and that's it.

With Drupal you don't deploy the content, like in Hugo, just code changes, but it does entail a lot more than just pushing the code: You still have to run composer, execute the database updates, empty the caches and import the configuration.

## In a nutshell

I loved working with Hugo. I knew I wanted something agile and without frills and that I was probably going to make changes to the design as I am writing the content. The agility and the close relation between code and content makes it real fun to work with.

That doesn't mean that I don't like Drupal anymore. Working with something completely different also helped me identifying the *raison d'être* of Drupal itself. On the one hand I learned that I could have used Hugo for some of earlier projects I built in Drupal, mainly the ones that ended up being pretty static anyway.

But for other projects Drupal remains my weapon of choice: I still love the the power and flexibility of Drupal and the development experience for the more complex tasks at hand. 

I guess it's all about the right tool for the job.

## Interesting links
1. https://www.smashingmagazine.com/2015/11/static-website-generators-jekyll-middleman-roots-hugo-review/


