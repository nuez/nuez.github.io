---
author: "Teun van Veggel"
date: 2018-02-15
title: "How to build a super simple availability calendar."
weight: 10
---

As a freelancer I like my (potential) clients to be aware of my availability. I decided to build something that would allow me to fill in my availability in Google Calendar, which would then be displayed in a nice widget on the website.

The widget doesn't need to display anything but whether or not I am available or busy on a certain day. I figured that the good ol' jQuery Datepicker would do perfectly.

So here's what I did.

### 1. Get an API Key.

When you google for accessing the Google API, most forums will point you in the direction of the OAUTH2 protocol. Using OAuth would be necessary if we wanted to access restricted content. For accessing publicly accessible content, the Google API is a lot easier. All you need is an URL and an API key.

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

Fill in the two calendar IDS and your API Key. The script basically fetches the events of one 'busy' calendar I created and one 'free' calendar, and adds classes to our jQuery widget for both.

### 5. Add the necessary CSS.

In my case I chose to render the DatePicker widget without any shipped CSS: I just added the necessary styling myself.

This is the result:

<div id="datepicker"></div>