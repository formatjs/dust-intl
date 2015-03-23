/*
 * Copyright (c) 2011-2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* jshint node:true */
/* global describe, it, expect, dust, async, Intl, IntlMessageFormat */

'use strict';

// Use a fixed known date
var dateStr = 'Thu Jan 23 2014 18:00:44 GMT-0500 (EST)',
    timeStamp = 1390518044403;

describe('Helper `formatNumber`', function () {
    it('should be added to dust', function () {
        expect(dust.helpers).to.have.keys('formatNumber');
    });

    it('should be a function', function () {
        expect(dust.helpers.formatNumber).to.be.a('function');
    });

    it('should throw if called with out a value', function (done) {
        var tmpl = '{@formatNumber /}',
            expected = new ReferenceError('@formatNumber needs a `val` parameter');
        dust.renderSource(tmpl, {}, function (err, out) {
            expect(err).to.be.a(ReferenceError);
            expect(err.toString()).to.equal(expected.toString());
            done();
        });
    });

    describe('used to format numbers', function () {
        it('should return a string', function (done) {
            var tmpl = '{@formatNumber val="4" /}',
                expected = "4";
            dust.renderSource(tmpl, {}, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        it('should return a decimal as a string', function (done) {
            var tmpl = '{@formatNumber val=NUM /}',
                ctx = { NUM: 4.004 },
                expected = "4.004";
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        it('should return a formatted string with a thousand separator', function (done) {
            var tmpl = '{@formatNumber val=NUM /}',
                ctx = { NUM: 40000 },
                expected = "40,000";
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        it('should return a formatted string with a thousand separator and decimal', function (done) {
            var tmpl = '{@formatNumber val=NUM /}',
                ctx = { NUM: 40000.004 },
                expected = "40,000.004";
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        it('should work wwith a value from context', function (done) {
            var tmpl = '{@formatNumber val="{THOUSANDS}{HUNDREDS}" /}',
                ctx = {
                    THOUSANDS: '40',
                    HUNDREDS: '000'
                },
                expected = "40,000";
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        describe('in another locale', function () {
            it('should return a string', function (done) {
                var tmpl = '{@formatNumber val="4" locales="de" /}',
                    ctx = {},
                    expected = "4";
                dust.renderSource(tmpl, ctx, function (err, out) {
                    if (err) { return done(err); }

                    expect(out).to.equal(expected);
                    done();
                });
            });

            it('should return a decimal as a string', function (done) {
                var tmpl = '{@formatNumber val=NUM locales="de-DE" /}',
                    ctx = { NUM: 4.004 },
                    expected = "4,004";
                dust.renderSource(tmpl, ctx, function (err, out) {
                    if (err) { return done(err); }

                    expect(out).to.equal(expected);
                    done();
                });
            });

            it('should return a formatted string with a thousand separator', function (done) {
                var tmpl = '{@formatNumber val=NUM locales="de-DE" /}',
                    ctx = { NUM: 40000 },
                    expected = "40.000";
                dust.renderSource(tmpl, ctx, function (err, out) {
                    if (err) { return done(err); }

                    expect(out).to.equal(expected);
                    done();
                });
            });

            it('should return a formatted string with a thousand separator and decimal', function (done) {
                var tmpl = '{@formatNumber val=NUM locales="de-DE" /}',
                    ctx = { NUM: 40000.004 },
                    expected = "40.000,004";
                dust.renderSource(tmpl, ctx, function (err, out) {
                    if (err) { return done(err); }

                    expect(out).to.equal(expected);
                    done();
                });
            });

            it('should work wwith a locale from context', function (done) {
                var tmpl = '{@formatNumber val=NUM locales="{LANG}-{REGION}" /}',
                    ctx = {
                        NUM: 40000.004,
                        LANG: 'de',
                        REGION: 'DE'
                    },
                    expected = "40.000,004";
                dust.renderSource(tmpl, ctx, function (err, out) {
                    if (err) { return done(err); }

                    expect(out).to.equal(expected);
                    done();
                });
            });

            it('should work wwith a locale from explicit context', function (done) {
                var tmpl = '{@formatNumber val=NUM /}',
                    ctx = {
                        intl: {
                            locales: 'de-DE'
                        },
                        NUM: 40000.004
                    },
                    expected = "40.000,004";
                dust.renderSource(tmpl, ctx, function (err, out) {
                    if (err) { return done(err); }

                    expect(out).to.equal(expected);
                    done();
                });
            });

            it('should work with a locale from global context', function (done) {
                var tmpl = '{@formatNumber val=NUM /}',
                    baseCtx = dust.makeBase({
                        intl: {
                            locales: 'de-DE'
                        }
                    }),
                    ctx = {
                        NUM: 40000.004
                    },
                    expected = "40.000,004";
                dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
                    if (err) { return done(err); }

                    expect(out).to.equal(expected);
                    done();
                });
            });

            it('should use locale from param (if exists), rather than global context', function (done) {
                var tmpl = '{@formatNumber val=NUM locales="en-US" /}',
                    baseCtx = dust.makeBase({
                        intl: {
                            locales: 'de-DE'
                        }
                    }),
                    ctx = {
                        NUM: 40000.004
                    },
                    expected = "40,000.004"; // en-US locale
                dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
                    if (err) { return done(err); }

                    expect(out).to.equal(expected);
                    done();
                });
            });

            it('should use locale from explicit context (if exists), rather than global context', function (done) {
                var tmpl = '{@formatNumber val=NUM /}',
                    baseCtx = dust.makeBase({
                        intl: {
                            locales: 'de-DE'
                        }
                    }),
                    ctx = {
                        intl: {
                            locales: 'en-US'
                        },
                        NUM: 40000.004
                    },
                    expected = "40,000.004"; // en-US locale
                dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
                    if (err) { return done(err); }

                    expect(out).to.equal(expected);
                    done();
                });
            });
        });
    });

    describe('used to format currency', function () {
        it('should return a string formatted to currency', function (done) {
            var name = 'number6',
                tmpl = '{@formatNumber val="40000" locales="en-US" style="currency" currency=CURRENCY /}';
            dust.loadSource(dust.compile(tmpl, name));
            async.series([
                function (taskDone) {
                    dust.render(name, { CURRENCY: 'USD' }, function (err, out) {
                        expect(out, 'USD').to.equal('$40,000.00');
                        taskDone(err);
                    });
                },
                function (taskDone) {
                    dust.render(name, { CURRENCY: 'EUR' }, function (err, out) {
                        expect(out, 'EUR').to.equal('€40,000.00');
                        taskDone(err);
                    });
                },
                function (taskDone) {
                    dust.render(name, { CURRENCY: 'JPY' }, function (err, out) {
                        expect(out, 'JPY').to.equal('¥40,000');
                        taskDone(err);
                    });
                }
            ], done);
        });

        it('should return a string formatted to currency with code', function (done) {
            var name = 'number7',
                tmpl = '{@formatNumber val="40000" style="currency" currency=CURRENCY currencyDisplay="code" /}';
            dust.loadSource(dust.compile(tmpl, name));
            async.series([
                function (taskDone) {
                    dust.render(name, { CURRENCY: 'USD' }, function (err, out) {
                        expect(out, 'USD').to.equal('USD40,000.00');
                        taskDone(err);
                    });
                },
                function (taskDone) {
                    dust.render(name, { CURRENCY: 'EUR' }, function (err, out) {
                        expect(out, 'EUR').to.equal('EUR40,000.00');
                        taskDone(err);
                    });
                },
                function (taskDone) {
                    dust.render(name, { CURRENCY: 'JPY' }, function (err, out) {
                        expect(out, 'JPY').to.equal('JPY40,000');
                        taskDone(err);
                    });
                }
            ], done);
        });

        it('should function within an `each` block helper', function (done) {
            var tmpl = '{#currencies} {@formatNumber val=AMOUNT locales="en-US" style="currency" currency=CURRENCY /}{/currencies}',
                ctx = {
                    currencies: [
                        { AMOUNT: 3, CURRENCY: 'USD' },
                        { AMOUNT: 8, CURRENCY: 'EUR' },
                        { AMOUNT: 10, CURRENCY: 'JPY' }
                    ]
                },
                expected = " $3.00 €8.00 ¥10";
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        it('should return a currency even when using a different locale', function (done) {
            var name = 'number9',
                tmpl = '{@formatNumber val="40000" locales="de-DE" style="currency" currency=CURRENCY/}';
            dust.loadSource(dust.compile(tmpl, name));
            async.series([
                function (taskDone) {
                    dust.render(name, { CURRENCY: 'USD' }, function (err, out) {
                        expect(out, 'USD->de-DE').to.equal('40.000,00 $');
                        taskDone(err);
                    });
                },
                function (taskDone) {
                    dust.render(name, { CURRENCY: 'EUR' }, function (err, out) {
                        expect(out, 'EUR->de-DE').to.equal('40.000,00 €');
                        taskDone(err);
                    });
                },
                function (taskDone) {
                    dust.render(name, { CURRENCY: 'JPY' }, function (err, out) {
                        expect(out, 'JPY->de-DE').to.equal('40.000 ¥');
                        taskDone(err);
                    });
                }
            ], done);
        });

        it('should return a currency even when using a different locale from global context', function (done) {
            var name = 'number9',
                baseCtx = dust.makeBase({
                    intl: {
                        locales: 'de-DE'
                    }
                }),
                tmpl = '{@formatNumber val="40000" style="currency" currency=CURRENCY/}';
            dust.loadSource(dust.compile(tmpl, name));
            async.series([
                function (taskDone) {
                    dust.render(name, baseCtx.push({ CURRENCY: 'USD' }), function (err, out) {
                        expect(out, 'USD->de-DE').to.equal('40.000,00 $');
                        taskDone(err);
                    });
                },
                function (taskDone) {
                    dust.render(name, baseCtx.push({ CURRENCY: 'EUR' }), function (err, out) {
                        expect(out, 'EUR->de-DE').to.equal('40.000,00 €');
                        taskDone(err);
                    });
                },
                function (taskDone) {
                    dust.render(name, baseCtx.push({ CURRENCY: 'JPY' }), function (err, out) {
                        expect(out, 'JPY->de-DE').to.equal('40.000 ¥');
                        taskDone(err);
                    });
                }
            ], done);
        });

        it('should return a currency even when using a different locale from param (if exists), rather than locale in global context', function (done) {
            var name = 'number9',
                baseCtx = dust.makeBase({
                    intl: {
                        locales: 'de-DE'
                    }
                }),
                tmpl = '{@formatNumber val="40000" style="currency" currency=CURRENCY/}';
            dust.loadSource(dust.compile(tmpl, name));
            async.series([
                function (taskDone) {
                    var ctx = {
                        CURRENCY: 'USD',
                        intl: {
                            locales: 'en-US'
                        }
                    };
                    dust.render(name, baseCtx.push(ctx), function (err, out) {
                        expect(out, 'USD->en-US').to.equal('$40,000.00');
                        taskDone(err);
                    });
                },
                function (taskDone) {
                    var ctx = {
                        CURRENCY: 'EUR',
                        intl: {
                            locales: 'en-US'
                        }
                    };
                    dust.render(name, baseCtx.push(ctx), function (err, out) {
                        expect(out, 'EUR->en-US').to.equal('€40,000.00');
                        taskDone(err);
                    });
                },
                function (taskDone) {
                    var ctx = {
                        CURRENCY: 'JPY',
                        intl: {
                            locales: 'en-US'
                        }
                    };
                    dust.render(name, baseCtx.push(ctx), function (err, out) {
                        expect(out, 'JPY->en-US').to.equal('¥40,000');
                        taskDone(err);
                    });
                }
            ], done);
        });

        it('should work with a currency from context', function (done) {
            var tmpl = '{@formatNumber val=AMOUNT style="currency" currency="{CURRENCY}" /}',
                ctx = {
                    AMOUNT: 40000.004,
                    CURRENCY: 'EUR'
                },
                expected = "€40,000.00";
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });
    });

    describe('used to format percentages', function () {
        it('should return a string formatted to a percent', function (done) {
            var tmpl = '{@formatNumber val="400" style="percent"/}',
                ctx = {},
                expected = "40,000%";
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        it('should return a perctage when using a different locale', function (done) {
            var tmpl = '{@formatNumber val="400" locales="de-DE" style="percent"/}',
                ctx = {},
                expected = "40.000 %";
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        it('should return a perctage when using a different locale from global context', function (done) {
            var tmpl = '{@formatNumber val="400" style="percent"/}',
                baseCtx = dust.makeBase({
                    intl: {
                        locales: 'de-DE'
                    }
                }),
                ctx = {},
                expected = "40.000 %";  // de-DE locales
            dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        it('should return a perctage when using a locale from param (if exists), rather than from global context', function (done) {
            var tmpl = '{@formatNumber val="400" style="percent" locales="fr-FR" /}',
                baseCtx = dust.makeBase({
                    intl: {
                        locales: 'de-DE'
                    }
                }),
                ctx = {},
                expected = "40 000 %";  // fr-FR locales
            dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });
    });
});


describe('Helper `formatDate`', function () {
    it('should be added to dust', function () {
        expect(dust.helpers).to.have.keys('formatDate');
    });

    it('should be a function', function () {
        expect(dust.helpers.formatDate).to.be.a('function');
    });

    it('should throw if called with out a value', function (done) {
        var tmpl = '{@formatDate /}',
            expected = new ReferenceError('@formatDate needs a `val` parameter');
        dust.renderSource(tmpl, {}, function (err, out) {
            expect(err).to.be.a(ReferenceError);
            expect(err.toString()).to.equal(expected.toString());
            done();
        });
    });

    it('should throw if called with an invalid date value', function (done) {
        var tmpl = '{@formatDate val="some garbage!" /}',
            expected = new TypeError('@formatDate requires a valid date or timestamp `val`');
        dust.renderSource(tmpl, {}, function (err, out) {
            expect(err).to.be.a(TypeError);
            expect(err.toString()).to.equal(expected.toString());
            done();
        });
    });

    it('should return a formatted string (date)', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" locales="en-US" /}',
            ctx = {},
            expected = "1/23/2014";
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string (date) using different locale', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" locales="de-DE" /}',
            ctx = {},
            expected = "23.1.2014"; // de-DE locales
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string (date) using different locale from global context', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" /}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'de-DE'
                }
            }),
            ctx = {},
            expected = "23.1.2014"; // de-DE locales
        dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string (date) using different locale from param (if exists) rather than from global context', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" locales="fr-FR" /}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'de-DE'
                }
            }),
            ctx = {},
            expected = "23/1/2014"; // fr-FR locales
        dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string (time)', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" locales="en-US" /}',
            ctx = {},
            expected = "1/23/2014";
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string (time) using different locale', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" locales="de-DE" /}',
            ctx = {},
            expected = "23.1.2014";
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string (time) using different locale from global context', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" /}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'de-DE'
                }
            }),
            ctx = {},
            expected = "23.1.2014";
        dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string (time) using different locale from param (if exists) rather than from global context', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" locales="fr-FR" /}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'de-DE'
                }
            }),
            ctx = {},
            expected = "23/1/2014";
        dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    /** SINGLE VALUES ARE MUTED FOR NOW :: https://github.com/andyearnshaw/Intl.js/issues/56
    it('should return a formatted string of option requested', function (done) {
        var tmpl = '{@formatDate val=DATE year="numeric" /}',
            ctx = { DATE: dateStr },
            expected = "2014";
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });
    */

    it('should return a formatted string of just the time', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" locales="en-US" hour="numeric" minute="numeric" timeZone="UTC"/}',
            ctx = {},
            expected = '11:00 PM',
            d = new Date(timeStamp);
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string of just the time using different locales', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" hour="numeric" minute="numeric" timeZone="UTC" locales="de-DE"/}',
            ctx = {},
            expected = '23:00',
            d = new Date(timeStamp);
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string of just the time using different locales from global context', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" hour="numeric" minute="numeric" timeZone="UTC"/}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'de-DE'
                }
            }),
            ctx = {},
            expected = '23:00',
            d = new Date(timeStamp);
        dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should work with format options from context', function (done) {
        var tmpl = '{@formatDate val="' + dateStr + '" locales="en-US" hour=HOUR minute="{MINUTE}" timeZone="UTC"/}',
            ctx = {
                HOUR: 'numeric',
                MINUTE: 'numeric'
            },
            expected = '11:00 PM',
            d = new Date(timeStamp);
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should work to format the epoch date', function (done) {
        var tmpl = '{@formatDate val="' + new Date(0) + '" locales="en-US" /}',
            ctx = {},
            expected = new Intl.DateTimeFormat('en-US').format(0);
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });
});


describe('Helper `formatRelative`', function () {
    function now() {
        return new Date().getTime();
    }
    function timeToStr(time) {
        return new Date(time).toUTCString();
    }

    it('should be added to dust', function () {
        expect(dust.helpers).to.have.keys('formatRelative');
    });

    it('should be a function', function () {
        expect(dust.helpers.formatRelative).to.be.a('function');
    });

    it('should throw if called with out a value', function (done) {
        var tmpl = '{@formatRelative /}',
            expected = new ReferenceError('@formatRelative needs a `val` parameter');
        dust.renderSource(tmpl, {}, function (err, out) {
            expect(err).to.be.a(ReferenceError);
            expect(err.toString()).to.equal(expected.toString());
            done();
        });
    });

    it('should throw if called with an invalid date value', function (done) {
        var tmpl = '{@formatRelative val="some garbage!" /}',
            expected = new TypeError('@formatRelative requires a valid date or timestamp `val`');
        dust.renderSource(tmpl, {}, function (err, out) {
            expect(err).to.be.a(TypeError);
            expect(err.toString()).to.equal(expected.toString());
            done();
        });
    });

    it('should return a formatted string relative to "now"', function (done) {
        var oneDayAgo = timeToStr(now() - (24 * 60 * 60 * 1000));

        var tmpl = '{@formatRelative val="' + oneDayAgo + '" locales="en-US" /}',
            ctx = {},
            expected = "yesterday";
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string relative to "now" using different locale', function (done) {
        var oneDayAgo = timeToStr(now() - (24 * 60 * 60 * 1000));

        var tmpl = '{@formatRelative val="' + oneDayAgo + '" locales="de-DE" /}',
            ctx = {},
            expected = "gestern"; // de-DE locales
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string relative to "now" using different locale from global context', function (done) {
        var oneDayAgo = timeToStr(now() - (24 * 60 * 60 * 1000));

        var tmpl = '{@formatRelative val="' + oneDayAgo + '" /}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'de-DE'
                }
            }),
            ctx = {},
            expected = "gestern"; // de-DE locales
        dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string relative to "now" using different locale from param (if exists) rather than from global context', function (done) {
        var oneDayAgo = timeToStr(now() - (24 * 60 * 60 * 1000));

        var tmpl = '{@formatRelative val="' + oneDayAgo + '" locales="fr-FR" /}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'de-DE'
                }
            }),
            ctx = {},
            expected = "hier"; // fr-FR locales
        dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should work with format options from context', function (done) {
        var oneDayAgo = timeToStr(now() - (24 * 60 * 60 * 1000));

        var tmpl = '{@formatRelative val="' + oneDayAgo + '" locales="en-US" units=HOUR style="{STYLE}"/}',
            ctx = {
                HOUR: 'hour',
                STYLE: 'numeric'
            },
            expected = '24 hours ago',
            d = new Date(timeStamp);
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should work with a named format from context', function (done) {
        var twoDaysAgo = timeToStr(now() - (2 * 24 * 60 * 60 * 1000));

        var tmpl = '{@formatRelative val="' + twoDaysAgo + '" formatName="hours" /}';

        var context = {
            intl: {
                locales: 'en-US',
                formats: {
                    relative: {
                        hours: {
                            units: 'hour',
                            style: 'numeric'
                        }
                    }
                }
            }
        };

        dust.renderSource(tmpl, context, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal('48 hours ago');
            done();
        });
    });
});


describe('Helper `formatMessage`', function () {
    it('should be added to dust', function () {
        expect(dust.helpers).to.have.keys('formatMessage');
    });

    it('should be a function', function () {
        expect(dust.helpers.formatMessage).to.be.a('function');
    });

    it('should throw if called with out a value', function (done) {
        var tmpl = '{@formatMessage /}',
            expected = new ReferenceError('@formatMessage needs either a `_msg` or `_key` parameter');
        dust.renderSource(tmpl, {}, function (err, out) {
            expect(err).to.be.a(ReferenceError);
            expect(err.toString()).to.equal(expected.toString());
            done();
        });
    });

    it('should return a formatted string', function (done) {
        var tmpl = '{@formatMessage _msg=MSG firstName=firstName lastName=lastName /}',
            ctx = {
                MSG: 'Hi, my name is {firstName} {lastName}.',
                firstName: 'Anthony',
                lastName: 'Pipkin'
            },
            expected = "Hi, my name is Anthony Pipkin.";
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a escape HTML values', function (done) {
        var tmpl = '{@formatMessage _msg=MSG name=name /}',
            ctx = {
                MSG: 'Hi, my name is {name}.',
                name: '<b>Eric</b>'
            },
            expected = 'Hi, my name is &lt;b&gt;Eric&lt;/b&gt;.';
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string with formatted numbers and dates', function (done) {
        var tmpl = '{@formatMessage _msg=POP_MSG locales="en-US" city=city population=population census_date=census_date timeZone=timeZone/}',
            ctx = {
                POP_MSG: '{city} has a population of {population, number, integer} as of {census_date, date, long}.',
                city: 'Atlanta',
                population: 5475213,
                census_date: (new Date('1/1/2010')).getTime(),
                timeZone: 'UTC'
            },
            expected = "Atlanta has a population of 5,475,213 as of January 1, 2010.";
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string with formatted numbers and dates in a different locale', function (done) {
        var tmpl = '{@formatMessage _msg=POP_MSG locales="de-DE" city=city population=population census_date=census_date timeZone=timeZone/}',
            ctx = {
                POP_MSG: '{city} has a population of {population, number, integer} as of {census_date, date, long}.',
                city: 'Atlanta',
                population: 5475213,
                census_date: (new Date('1/1/2010')),
                timeZone: 'UTC'
            },
            expected = "Atlanta has a population of 5.475.213 as of 1. Januar 2010.";
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string with formatted numbers and dates in a different locale from global context', function (done) {
        var tmpl = '{@formatMessage _msg=POP_MSG city=city population=population census_date=census_date timeZone=timeZone/}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'de-DE'
                }
            }),
            ctx = {
                POP_MSG: '{city} has a population of {population, number, integer} as of {census_date, date, long}.',
                city: 'Atlanta',
                population: 5475213,
                census_date: (new Date('1/1/2010')),
                timeZone: 'UTC'
            },
            expected = "Atlanta has a population of 5.475.213 as of 1. Januar 2010.";
        dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string with formatted numbers and dates in a different locale from param (if exists) rather than global context', function (done) {
        var tmpl = '{@formatMessage _msg=POP_MSG locales="fr-FR" city=city population=population census_date=census_date timeZone=timeZone/}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'de-DE'
                }
            }),
            ctx = {
                POP_MSG: '{city} has a population of {population, number, integer} as of {census_date, date, long}.',
                city: 'Atlanta',
                population: 5475213,
                census_date: (new Date('1/1/2010')),
                timeZone: 'UTC'
            },
            expected = "Atlanta has a population of 5 475 213 as of 1 janvier 2010.";   // fr-FR locales
        dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should return a formatted string with an `each` block', function (done) {
        var tmpl = '{#harvest} {@formatMessage _msg=HARVEST_MSG person=person count=count /}{/harvest}',
            ctx = {
                HARVEST_MSG: '{person} harvested {count, plural, one {# apple} other {# apples}}.',
                harvest: [
                    { person: 'Allison', count: 10 },
                    { person: 'Jeremy', count: 60 }
                ]
            },
            expected = " Allison harvested 10 apples. Jeremy harvested 60 apples.";
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should use a precompiled message', function (done) {
        var tmpl = '{@formatMessage _msg=MSG firstName=firstName lastName=lastName /}',
            ctx = {
                firstName: 'Anthony',
                lastName: 'Pipkin'
            },
            expected = "Hi, my name is Anthony Pipkin.";
        ctx.MSG = new IntlMessageFormat('Hi, my name is {firstName} {lastName}.');
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });
});


describe('Helper `intl`', function () {
    it('should be added to dust', function () {
        expect(dust.helpers).to.have.keys('intl');
    });

    it('should be a function', function () {
        expect(dust.helpers.intl).to.be.a('function');
    });

    it('should maintain a locale', function (done) {
        var name = 'intl3',
            tmpl = '{@formatNumber val=NUM/} {@intl locales="de-DE"}{@formatNumber val=NUM /}{/intl} {@formatNumber val=NUM/}',
            ctx = { NUM: 40000.004 },
            expected = '40,000.004 40.000,004 40,000.004';
        dust.loadSource(dust.compile(tmpl, name));
        dust.render(name, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should maintain a locale and fallback to global context', function (done) {
        var name = 'intl3',
            tmpl = '{@formatNumber val=NUM/} {@intl locales="de-DE"}{@formatNumber val=NUM /}{/intl} {@formatNumber val=NUM/}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'fr-FR'
                }
            }),
            ctx = { NUM: 40000.004 },
            expected = '40 000,004 40.000,004 40 000,004';
        dust.loadSource(dust.compile(tmpl, name));
        dust.render(name, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should maintain context regardless of depth', function (done) {
        var tmpl = '{@intl locales="de-DE"}{@intl locales="en-US"}{@formatNumber val=NUM/} {/intl}{@formatNumber val=NUM/}{/intl} {@formatNumber val=NUM/}',
            ctx = { NUM: 40000.004 },
            expected = '40,000.004 40.000,004 40,000.004';
        dust.renderSource(tmpl, ctx, function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    it('should maintain context regardless of depth and fallback to global context', function (done) {
        var tmpl = '{@intl locales="de-DE"}{@intl locales="en-US"}{@formatNumber val=NUM/} {/intl}{@formatNumber val=NUM/}{/intl} {@formatNumber val=NUM/}',
            baseCtx = dust.makeBase({
                intl: {
                    locales: 'fr-FR'
                }
            }),
            ctx = { NUM: 40000.004 },
            expected = '40,000.004 40.000,004 40 000,004';  // [en-US locales] [de-DE locales] [fr-FR locales from global context]
        dust.renderSource(tmpl, baseCtx.push(ctx), function (err, out) {
            if (err) { return done(err); }

            expect(out).to.equal(expected);
            done();
        });
    });

    describe('should provide `messages` for formatMessage', function (done) {
        it('strings', function (done) {
            var tmpl = '{@intl messages=intl.messages}{#harvest} {@formatMessage _key="HARVEST_MSG" person=person count=count /}{/harvest}{/intl}',
                ctx = {
                    intl: {
                        messages: {
                            HARVEST_MSG: '{person} harvested {count, plural, one {# apple} other {# apples}}.'
                        }
                    },
                    harvest: [
                        { person: 'Allison', count: 1 },
                        { person: 'Jeremy', count: 60 }
                    ]
                },
                expected = " Allison harvested 1 apple. Jeremy harvested 60 apples.";
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });
        it('precompiled object', function (done) {
            var tmpl = '{@intl messages=intl.messages}{@formatMessage _key="salutation" firstName=firstName lastName=lastName /}{/intl}',
                ctx = {
                    intl: { messages: {} },
                    firstName: 'Anthony',
                    lastName: 'Pipkin'
                },
                expected = "Hi, my name is Anthony Pipkin.";
            ctx.intl.messages.salutation = new IntlMessageFormat('Hi, my name is {firstName} {lastName}.');
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });
    });

    describe('should provide formats', function (done) {
        it('for formatNumber', function (done) {
            var tmpl = '{@intl locales="en-US" formats=intl.formats}{@formatNumber val=NUM formatName="usd"/} {@formatNumber val=NUM formatName="eur"/} {@formatNumber val=NUM style="currency" currency="USD"/}{/intl}',
                ctx = {
                    intl: {
                        formats: {
                            number: {
                                eur: { style: 'currency', currency: 'EUR' },
                                usd: { style: 'currency', currency: 'USD' }
                            }
                        }
                    },
                    NUM: 40000.004
                },
                expected = '$40,000.00 €40,000.00 $40,000.00';
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        it('for formatDate', function (done) {
            var tmpl = '{@intl locales="en-US" formats=intl.formats}{@formatDate val="' + dateStr + '" formatName="hm" timeZone="UTC"/}{/intl}',
                ctx = {
                    intl: {
                        formats: {
                            date: {
                                hm: { hour: 'numeric', minute: 'numeric' }
                            }
                        }
                    }
                },
                expected = "11:00 PM",
                d = new Date(timeStamp);
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });

        it('for formatMessage', function (done) {
            var tmpl = '{@intl locales="en-US" formats=intl.formats}{@formatMessage _msg=MSG product=PRODUCT price=PRICE deadline=DEADLINE timeZone=TZ/}{/intl}',
                ctx = {
                    MSG: '{product} cost {price, number, usd} (or {price, number, eur}) if ordered by {deadline, date, long}',
                    intl: {
                        formats: {
                            number: {
                                eur: { style: 'currency', currency: 'EUR' },
                                usd: { style: 'currency', currency: 'USD' }
                            }
                        }
                    },
                    PRODUCT: 'oranges',
                    PRICE: 40000.004,
                    DEADLINE: timeStamp,
                    TZ: 'UTC'
                },
                expected = "oranges cost $40,000.00 (or €40,000.00) if ordered by January 23, 2014";
            dust.renderSource(tmpl, ctx, function (err, out) {
                if (err) { return done(err); }

                expect(out).to.equal(expected);
                done();
            });
        });
    });
});
