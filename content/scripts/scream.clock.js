
(function ($) {

    $.fn.screamClock = function (options) {

        this.each(function () {

            var cnv, ctx, el,
                defaults,
                settings,
                radius,
                dialColor, dialBackgroundColor,
                secondHandColor, minuteHandColor, hourHandColor,
                hourCorrection, x, y;

            defaults = {
                size: 250,
                dialColor: '#000000',
                dialBackgroundColor: 'transparent',
                secondHandColor: '#3366FF',
                minuteHandColor: '#222222',
                hourHandColor: '#222222',
                hourCorrection: '+0',
                showNumerals: true,
                customTime: 60
            };

            settings = $.extend({}, defaults, options);

            el = this;

            el.size = settings.size;
            el.dialColor = settings.dialColor;
            el.dialBackgroundColor = settings.dialBackgroundColor;
            el.secondHandColor = settings.secondHandColor;
            el.minuteHandColor = settings.minuteHandColor;
            el.hourHandColor = settings.hourHandColor;
            el.hourCorrection = settings.hourCorrection;
            el.showNumerals = settings.showNumerals;

            el.brandText = settings.brandText;
            el.brandText2 = settings.brandText2;

            el.onEverySecond = settings.onEverySecond;

            el.customTime = settings.customTime;
            el.onEveryCustomTime = settings.onEveryCustomTime;

            cnv = document.createElement('canvas');
            ctx = cnv.getContext('2d');

            cnv.width = this.size;
            cnv.height = this.size;

            //append canvas to element
            $(cnv).appendTo(el);

            radius = parseInt(el.size / 2, 10);

            //translate 0,0 to center of circle:
            ctx.translate(radius, radius);


            function toRadians(deg) {

                return (Math.PI / 180) * deg;
            }

            function drawDial(color, bgcolor) {

                var dialRadius, dialBackRadius,
                    i, ang, sang, cang,
                    sx, sy,
                    ex, ey,
                    nx, ny,
                    text, textSize, textWidth,
                    brandtextWidth, brandtextWidth2;

                dialRadius = parseInt(radius - (el.size / 50), 10);
                dialBackRadius = radius - (el.size / 400);

                ctx.beginPath();
                ctx.arc(0, 0, dialBackRadius, 0, 360, false);
                ctx.fillStyle = bgcolor;
                ctx.fill();


                for (i = 1; i <= 60; i += 1) {

                    ang = Math.PI / 30 * i;
                    sang = Math.sin(ang);
                    cang = Math.cos(ang);

                    //hour marker/numeral
                    if (i % 5 === 0) {

                        ctx.lineWidth = parseInt(el.size / 50, 10);
                        sx = sang * (dialRadius - dialRadius / 9);
                        sy = cang * -(dialRadius - dialRadius / 9);
                        ex = sang * dialRadius;
                        ey = cang * -dialRadius;
                        nx = sang * (dialRadius - dialRadius / 4.2);
                        ny = cang * -(dialRadius - dialRadius / 4.2);
                        text = i / 5;
                        ctx.textBaseline = 'middle';
                        textSize = parseInt(el.size / 13, 10);
                        ctx.font = '100 ' + textSize + 'px helvetica';
                        textWidth = ctx.measureText(text).width;
                        ctx.beginPath();
                        ctx.fillStyle = color;

                        if (el.showNumerals) {
                            ctx.fillText(text, nx - (textWidth / 2), ny);
                        }
                        //minute marker
                    } else {

                        ctx.lineWidth = parseInt(el.size / 100, 10);
                        sx = sang * (dialRadius - dialRadius / 20);
                        sy = cang * -(dialRadius - dialRadius / 20);
                        ex = sang * dialRadius;
                        ey = cang * -dialRadius;
                    }

                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineCap = "round";
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(ex, ey);
                    ctx.stroke();
                }

                if (el.brandText !== undefined) {

                    ctx.font = '100 ' + parseInt(el.size / 28, 10) + 'px helvetica';
                    brandtextWidth = ctx.measureText(el.brandText).width;
                    ctx.fillText(el.brandText, -(brandtextWidth / 2), (el.size / 6));
                }

                if (el.brandText2 !== undefined) {

                    ctx.textBaseline = 'middle';
                    ctx.font = '100 ' + parseInt(el.size / 44, 10) + 'px helvetica';
                    brandtextWidth2 = ctx.measureText(el.brandText2).width;
                    ctx.fillText(el.brandText2, -(brandtextWidth2 / 2), (el.size / 5));
                }
            }


            function twelvebased(hour) {

                if (hour >= 12) {
                    hour = hour - 12;
                }
                return hour;
            }



            function drawHand(length) {

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, length * -1);
                ctx.stroke();
            }


            function drawSecondHand(seconds, color) {

                var shlength = (radius) - (el.size / 40);

                ctx.save();
                ctx.lineWidth = parseInt(el.size / 150, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
                ctx.rotate(toRadians(seconds * 6));

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(el.size / 80, 10);
                ctx.shadowOffsetX = parseInt(el.size / 200, 10);
                ctx.shadowOffsetY = parseInt(el.size / 200, 10);

                drawHand(shlength);

                //tail of secondhand
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, shlength / 15);
                ctx.lineWidth = parseInt(el.size / 30, 10);
                ctx.stroke();

                //round center
                ctx.beginPath();
                ctx.arc(0, 0, parseInt(el.size / 30, 10), 0, 360, false);
                ctx.fillStyle = color;

                ctx.fill();
                ctx.restore();
            }

            function drawMinuteHand(minutes, color) {

                var mhlength = el.size / 2.2;
                ctx.save();
                ctx.lineWidth = parseInt(el.size / 50, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
                ctx.rotate(toRadians(minutes * 6));

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(el.size / 50, 10);
                ctx.shadowOffsetX = parseInt(el.size / 250, 10);
                ctx.shadowOffsetY = parseInt(el.size / 250, 10);

                drawHand(mhlength);
                ctx.restore();
            }

            function drawHourHand(hours, color) {

                var hhlength = el.size / 3;
                ctx.save();
                ctx.lineWidth = parseInt(el.size / 25, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
                ctx.rotate(toRadians(hours * 30));

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(el.size / 50, 10);
                ctx.shadowOffsetX = parseInt(el.size / 300, 10);
                ctx.shadowOffsetY = parseInt(el.size / 300, 10);

                drawHand(hhlength);
                ctx.restore();
            }

            function timeToDecimal(time) {

                var h,
                    m;
                if (time !== undefined) {
                    h = twelvebased(time.getHours());
                    m = time.getMinutes();
                }
                return parseInt(h, 10) + (m / 60);
            }

            function numberCorrection(num) {

                if (num !== '+0' && num !== '') {

                    if (num.charAt(0) === '+') {

                        //addNum
                        return +num.charAt(1);
                    }
                    else {

                        //subNum
                        return -num.charAt(1);
                    }
                }
                else {

                    return 0;
                }
            }




            // Event Listeners
            if (el.onEverySecond !== undefined) {

                $(el).on('onEverySecond', function (e) {
                    el.onEverySecond();
                    e.preventDefault();
                });
            }
            if (el.onEveryCustomTime !== undefined) {

                $(el).on('onEveryCustomTime', function (e) {
                    el.onEveryCustomTime();
                    e.preventDefault();
                });
            }



            y = 0;
            var min = 0;

            function startClock(x, y) {

                var theDate, s, m, hours, mins, h;

                theDate = new Date();
                s = theDate.getSeconds();
                mins = theDate.getMinutes();
                m = mins + (s / 60);
                hours = theDate.getHours();
                h = twelvebased(hours + numberCorrection(el.hourCorrection)) + (m / 60);

                ctx.clearRect(-radius, -radius, el.size, el.size);

                drawDial(el.dialColor, el.dialBackgroundColor);

                drawHourHand(h, el.hourHandColor);
                drawMinuteHand(m, el.minuteHandColor);
                drawSecondHand(s, el.secondHandColor);

                //trigger every second custom event
                y += 1;
                if (y === 1) {

                    $(el).trigger('onEverySecond');
                    y = 0;
                }

                min += 1;
                if (min === el.customTime) {
                    $(el).trigger('onEveryCustomTime');
                    min = 0;
                }

                var synced_delay = 1000 - ((new Date().getTime()) % 1000);
                setTimeout(function () { startClock(x, y); }, synced_delay);
            }

            startClock(x, y);

        });
    };
}(jQuery));