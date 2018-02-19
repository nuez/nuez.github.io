---
author: "Teun van Veggel"
date: 2018-02-15
title: "How to build a super simple availability calendar."
weight: 10
description: "For my website I wanted a mini calendar showing my availability as a freelancer. I used jQuery and the Google Calendar API to build it."
---

As a freelancer I like my (potential) clients to be aware of my availability, so we both don't waste our time. To make the calendar as hassle-free as possible I wanted integrate it with Google Calendar, so all it would take is to fill in my availability there.

All I need is a simple view of a calendar, without details of each event: just whether or not I am available for work. I figured that the good ol' jQuery Datepicker would do just fine.

So here's what I did.

### 1. Get an API Key.

Although most of the documentation you find online about authenticating for Google APIs is about OAUTH2 and complicated authentication flows, authenticating for publicly accessible Google content is really simple: all you need is an API key.

Go to [https://console.developers.google.com](https://console.developers.google.com) and create a new project. Select ```credentials``` and create an *API Key*.  You can restrict the use of the key although you don't have to. Copy the API key value somewhere: we'll need it in our code.

<!--more-->

### 2. Create a public calendar.

![alt text](/images/calendar/google_settings.jpg "Calendar Settings");

Create a new calendar in your google calendar and set it to *public*. 

![alt text](/images/calendar/google_calendar_id.jpg "Calendar ID")

Copy the *Calendar ID*, we'll need it later.

In my case I created two calendars, one to display the dates that I am available, and the other for my 'busy calendar'.

### 3. Add the following HTML to your page.

```<div id="datepicker"></div>```

And add the jQuery dependencies to the HEAD of your page.

```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js"></script>

``` 
### 4. Add the following Javascript to your page.

```
$(document).ready(function () {
  $("#datepicker").datepicker({
    numberOfMonths: [3, 1],
    onChangeMonthYear: function () {
      setCalendar();
    },
    onSelect: function(){
      setCalendar();
    }
  });

  setCalendar();

  function setCalendar() {
    var api_key = '<GOOGLE API KEY>';
    var calendars = {
      free: '<CALENDAR_ID_FREE>',
      busy: '<CALENDAR_ID_BUSY>',
    };
    $.each(calendars, function (type, calendar_id) {
      $.ajax({
        url: "https://www.googleapis.com/calendar/v3/calendars/" + calendar_id + "/events?key=" + api_key,
        success: function (data) {
          data.items.forEach(function (item) {
            var start = new Date(item.start.date);
            var end = new Date(item.end.date);
            do {
              $('td[data-year="' + start.getFullYear() + '"][data-month="' + start.getMonth() + '"] a').filter(function () {
                return $(this).text() == start.getDate();
              }).addClass(type);
              start.setDate(start.getDate() + 1);
            } while (start.getTime() !== end.getTime());
          });
        }
      });
    });
  }
});
```

Fill in the two calendar IDS and your API Key.

On StackOverflow there is loads of information about accessing the Google API using OAUTH2, that one might forget that to access public information all we need is calling a URL: ```https://www.googleapis.com/calendar/v3/calendars/" + calendar_id + "/events?key=" + api_key``` 

We do have to pass our api_key so Google can track the use of their API (and limit it if necessary).

Once we have our event, we add classes to the days in the calendar accordingly, so we can theme it in CSS.

### 5. Add the necessary CSS.

In my case I chose to render the DatePicker widget without any shipped CSS: I added the necessary theming myself.

You can see the example [here](/contact).