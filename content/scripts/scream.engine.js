
var scream = scream || {};

scream.engine = function () {

    var intVal, myclock,

    initialize = function () {

        displayDate();
        displaySonosInfo();


        $('#ScreamClock').screamClock({

            size: $(document).height() / 1.4,

            showNumerals: true,
            brandText: '',//'SCREAMER',
            brandText2: '',//'some smaller text',

            onEverySecond: function () {

                // callback that should be fired every second
            },
            customTime: 10,
            onEveryCustomTime: function () {

                // callback that should be fired every custom time interval
                displayDate();
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
                    $('html, body, .footer').attr('style', 'background-color: #BFBFFF');
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


    displayDate = function () {

        // Use moment.js to output the current date/time as a string
        // hh is for the hours in 12-hour format, mm - minutes, ss-seconds (all with leading zeroes),
        // d is for day of week and A is for AM/PM

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

        // the library returns Sunday as the first day of the week, but we have Sunday at the end...
        var now = moment().format("hhmmssdA");
        var dayOfWeek = now[6];
        dayOfWeek--;

        // Sunday!
        if (dayOfWeek < 0) {
            // Make it last
            dayOfWeek = 6;
        }

        // mark the active day of the week
        $('.weekdays span').removeClass('active').eq(dayOfWeek).addClass('active');
    },


    displaySonosInfo = function () {

        data = { 'action': "current" };

        $.post("screamer.php", data, function (response) {
            $('.sonos-info').html(response);
        });
    };




    return {
        initialize: initialize
    };
}();
