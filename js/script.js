$(document).ready(function () {
  $("button.hamburger").click(function () {
    $(this).toggleClass('is-active');

    $("body > header").toggleClass('menu-active');
  });

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
    var api_key = 'AIzaSyA1PHgr8Toq5xwzyk2tcLSwqSBOh-jKivI';
    var calendars = {
      free: 'nuezweb.com_bbouqeod1ivrt3s1l0u3t3m770@group.calendar.google.com',
      busy: 'nuezweb.com_k0dn8t8i7g7mv3fim5m5ke9ifs@group.calendar.google.com',
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