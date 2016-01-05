var scream = scream || {};

scream.engine = function () {

    var settings = {
        alarm: "4:15",
        warmColour: "#F7AC57",
        coldColour: "#BFBFFF",
        sonosIP: "192.168.1.59"
    },

	initialize = function () {

	    loadSettings();

	    displayDate();
	    displaySonosInfo();


	    $('.btn-play, .btn-stop, .btn-pause').click(function () {

	        var action = $(this).data('action');

	        data = {
	            'action': $(this).data('action'),
	            'IP': settings.sonosIP
	        };
	        $.post("screamer.php", data, function (response) { });

	        if (action == "pause") {
	            $('.sonos-info').html('');
	        }
	    });



	    $('.clockpicker input').val(settings.alarm);
	    $('.clockpicker').clockpicker({

	        afterDone: function () {
	            // Save settings
	            settings.alarm = $('.clockpicker input').val();
	            saveSettings();
	        }
	    });


	    $('#ScreamClock').screamClock({

	        size: $(document).height() / 1.4,

	        showNumerals: true,
	        brandText: '', //'SCREAMER',
	        brandText2: '', //'some smaller text',

	        onEverySecond: function () {

	            // callback that should be fired every second
	            checkAlarm();
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
	                //$('html, body, .footer').attr('style', 'background-color: #F7AC57');
	                $('html, body, .footer').attr('style', 'background-color: ' + settings.warmColour);
	            } else {
	                //$('html, body, .footer').attr('style', 'background-color: #BFBFFF');
	                $('html, body, .footer').attr('style', 'background-color: ' + settings.coldColour);
	            }

	            //html = '<h1 class="icon-' + weather.code + '"></h1>';
	            //html += '<h2>' + weather.temp + '&deg;</h2>';
	            
	            //html += '<ul><li>' + weather.city + ', ' + weather.region + '</li>';
	            //html += '<li class="currently">' + weather.currently + '</li></ul>';
	            //html += '<li>'+weather.tempAlt+'&deg;C</li></ul>';

	            //var timestamp = moment(weather.updated);
	            //html += '<p class="updated">Updated ' + moment(timestamp).fromNow() + '</p>';

	            $("#weather .weather-icon").html('<h1 class="icon-' + weather.code + '"></h1>');
	            $("#weather .weather-temp").html('<h3>' + weather.temp + '&deg;</h3>');
	        },

	        error: function (error) {
	            $("#weather").html('<p>' + error + '</p>');
	        }
	    });
	},

    checkAlarm = function () {

        var currentTime = moment().format("HH:mm");

        if (currentTime === settings.alarm) {

            $.post("screamer.php", { 'action': 'play' }, function (response) { });
        }
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

	    var data = {
	        'action': "current",
	        'IP': settings.sonosIP
	    };

	    $.post("screamer.php", data, function (response) {
	        $('.sonos-info').html(response);
	    });
	},

	loadSettings = function () {

	    var data = {
	        "action": "load"
	    };

	    $.post("settings.php", data, function (response) {

	        if (response !== '') {

	            //alert(JSON.stringify(response));
	            settings = JSON.parse(response);

	            //$('.clockpicker input').val(settings.alarm);

	            // set sonos IP address and background colour

	            //alert("settings.Setting1: " + settings.Setting1);
	            //alert("settings.Setting2: " + settings.Setting2);
	            //alert("settings.Setting3: " + settings.Setting3);
	        }
	    });
	    saveSettings();
	},

	saveSettings = function () {

	    var data = {
	        "action": "save",
	        "settings": settings
	    };

	    $.post("settings.php", data, function (response) {

	        //if (response !== "1") {
	        //    alert(response);
	        //}
	    });
	};



    return {
        initialize: initialize
    };
}();
