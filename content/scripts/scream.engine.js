/// <reference path="analog.clock.js" />


var scream = scream || {};

scream.engine = function () {

    var intVal, myclock,

    initialize = function () {

        displaySonosInfo();

        $('#ScreamClock').screamClock({

            size: $(document).height() / 1.4,

            showNumerals: true,
            brandText: '',//'SCREAMER',
            brandText2: '',//'some smaller text',

            onEverySecond: function () {
                // callback that should be fired every second
                update();
            },
            customTime: 10,
            onEveryCustomTime: function () {
                // callback that should be fired every minute
                displaySonosInfo();
            }
        });


        $.simpleWeather({
            woeid: '24116659', // Georgetown, Ontario
            location: '',
            unit: 'c',

            success: function (weather) {

                if (weather.temp > 18) {
                    $('html, body, .footer').attr('style', 'background-color: #F7AC57');
                } else {
                    $('html, body, .footer').attr('style', 'background-color: #0091c2');
                }

                html = '<h1 class="icon-' + weather.code + '"></h1>';
                html += '<h2>' + weather.temp + '&deg;</h2>';
                //html += '<ul><li>' + weather.city + ', ' + weather.region + '</li>';
                //html += '<li class="currently">' + weather.currently + '</li></ul>';
                //html += '<li>'+weather.tempAlt+'&deg;C</li></ul>';

                //var timestamp = moment(weather.updated);
                //html += '<p class="updated">Updated ' + moment(timestamp).fromNow() + '</p>';

                $("#weather").html(html);
            },

            error: function (error) {
                $("#weather").html('<p>' + error + '</p>');
            }
        });
    },


    update = function () {

        // Use moment.js to output the current time as a string
        // hh is for the hours in 12-hour format, mm - minutes, ss-seconds (all with leading zeroes),
        // d is for day of week and A is for AM/PM

        var now = moment().format("hhmmssdA");
        var currentDate = moment().format("MMMM DD, YYYY");
        $('.current-date').html(currentDate);

        // hour     now[0]
        // hour     now[1]
        // minute   now[2]
        // minute   now[3]
        // second   now[4]
        // second   now[5]
        // day      now[6]
        // ampm     now[7] + now[8]

        // The library returns Sunday as the first day of the week.
        // But I want Sunday at the end...
        var dow = now[6];
        dow--;

        // Sunday!
        if (dow < 0) {
            // Make it last
            dow = 6;
        }

        // Mark the active day of the week
        $('.weekdays span').removeClass('active').eq(dow).addClass('active');
    },


    displaySonosInfo = function () {

        data = { 'action': "current" };

        $.post("clock.php", data, function (response) {
            $('.sonos-info').html(response);
        });
    };




    return {
        initialize: initialize
    };
}();
