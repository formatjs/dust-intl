/*
 * Copyright (c) 2011-2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/* jshint node:true */
/* global describe, it, locale, currency */

'use strict';

// set locale
global.locale = "en";
global.currency = "USD";

var async,
    chai,
    expect,
    Dust,
    intl,
    intlMsg;

if (typeof require === 'function') {
    async = require('async');
    chai = require('chai');
    Dust = require('dustjs-linkedin');

    intl = require('intl');

    if (typeof Intl === 'undefined') {
        global.Intl = intl;
    }

    // load in message format
    require('intl-messageformat');
    require('intl-messageformat/locale-data/en');

    require('../lib/helpers.js').register(Dust);
}

expect = chai.expect;


describe('Helper `intlNumber`', function () {
    it('should be added to Dust', function () {
        expect(Dust.helpers).to.include.keys('intlNumber');
    });

    it('should be a function', function () {
        expect(Dust.helpers.intlNumber).to.be.a('function');
    });

    it('should throw if called with out a value', function () {
        try {
            var name = 'number0',
                tmpl = '{@intlNumber /}';
            Dust.loadSource(Dust.compile(tmpl, name));
            Dust.render(name);
        } catch (e) {
            var err = new ReferenceError('A number must be provided.');
            expect(e.toString()).to.equal(err.toString());
        }
    });

    describe('used to format numbers', function () {
        it('should return a string', function () {
            var name = 'number1',
                tmpl = "{@intlNumber val=4 /}",
                expected = "4";
            Dust.loadSource(Dust.compile(tmpl, name));
            Dust.render(name, {}, function(err, out) {
                expect(out).to.equal(expected);
            });
        });

        it('should return a decimal as a string', function () {
            var name = 'number2',
                tmpl = '{@intlNumber val=NUM /}',
                ctx = { NUM: 4.004 },
                expected = "4.004";
            Dust.loadSource(Dust.compile(tmpl, name));
            Dust.render(name, ctx, function(err, out) {
                expect(out).to.equal(expected);
            });
        });

        it('should return a formatted string with a thousand separator', function () {
            var name = 'number3',
                tmpl = '{@intlNumber val=NUM /}',
                ctx = { NUM: 40000 },
                expected = "40,000";
            Dust.loadSource(Dust.compile(tmpl, name));
            Dust.render(name, ctx, function(err, out) {
                expect(out).to.equal(expected);
            });
        });

        it('should return a formatted string with a thousand separator and decimal', function () {
            var name = 'number4',
                tmpl = '{@intlNumber val=NUM /}',
                ctx = { NUM: 40000.004 },
                expected = "40,000.004";
            Dust.loadSource(Dust.compile(tmpl, name));
            Dust.render(name, ctx, function(err, out) {
                expect(out).to.equal(expected);
            });
        });

        describe('in another locale', function () {
            it('should return a string', function () {
                var name = 'number5',
                    tmpl = '{@intlNumber val=4 locale="de-DE" /}',
                    ctx = {},
                    expected = "4";
                Dust.loadSource(Dust.compile(tmpl, name));
                Dust.render(name, ctx, function(err, out) {
                    expect(out).to.equal(expected);
                });
            });

            it('should return a decimal as a string', function () {
                var name = 'number5',
                    tmpl = '{@intlNumber val=NUM locale="de-DE" /}',
                    ctx = { NUM: 4.004 },
                    expected = "4,004";
                Dust.loadSource(Dust.compile(tmpl, name));
                Dust.render(name, ctx, function(err, out) {
                    expect(out).to.equal(expected);
                });
            });

            it('should return a formatted string with a thousand separator', function () {
                var name = 'number5',
                    tmpl = '{@intlNumber val=NUM locale="de-DE" /}',
                    ctx = { NUM: 40000 },
                    expected = "40.000";
                Dust.loadSource(Dust.compile(tmpl, name));
                Dust.render(name, ctx, function(err, out) {
                    expect(out).to.equal(expected);
                });
            });

            it('should return a formatted string with a thousand separator and decimal', function () {
                var name = 'number5',
                    tmpl = '{@intlNumber val=NUM locale="de-DE" /}',
                    ctx = { NUM: 40000.004 },
                    expected = "40.000,004";
                Dust.loadSource(Dust.compile(tmpl, name));
                Dust.render(name, ctx, function(err, out) {
                    expect(out).to.equal(expected);
                });
            });
        });
    });

    describe('used to format currency', function () {
        it('should return a string formatted to currency', function () {
            var name = 'number6',
                tmpl = '{@intlNumber val=40000 style="currency" currency=CURRENCY /}';
            Dust.loadSource(Dust.compile(tmpl, name));
            async.series([
                function(taskDone) {
                    Dust.render(name, { CURRENCY: 'USD' }, function(err, out) {
                        expect(out, 'USD').to.equal('$40,000.00');
                        taskDone(err);
                    });
                },
                function(taskDone) {
                    Dust.render(name, { CURRENCY: 'EUR' }, function(err, out) {
                        expect(out, 'EUR').to.equal('€40,000.00');
                        taskDone(err);
                    });
                },
                function(taskDone) {
                    Dust.render(name, { CURRENCY: 'JPY' }, function(err, out) {
                        expect(out, 'JPY').to.equal('¥40,000');
                        taskDone(err);
                    });
                }
            ], function(err) {
                throw err;
            });
        });

        it('should return a string formatted to currency with code', function () {
            var name = 'number7',
                tmpl = '{@intlNumber val=40000 style="currency" currency=CURRENCY currencyDisplay="code" /}';
            Dust.loadSource(Dust.compile(tmpl, name));
            async.series([
                function(taskDone) {
                    Dust.render(name, { CURRENCY: 'USD' }, function(err, out) {
                        expect(out, 'USD').to.equal('USD40,000.00');
                        taskDone(err);
                    });
                },
                function(taskDone) {
                    Dust.render(name, { CURRENCY: 'EUR' }, function(err, out) {
                        expect(out, 'EUR').to.equal('EUR40,000.00');
                        taskDone(err);
                    });
                },
                function(taskDone) {
                    Dust.render(name, { CURRENCY: 'JPY' }, function(err, out) {
                        expect(out, 'JPY').to.equal('JPY40,000');
                        taskDone(err);
                    });
                }
            ], function(err) {
                throw err;
            });
        });

        it('should function within an `each` block helper', function () {
            var name = 'number8',
                tmpl = '{#currencies} {@intlNumber val=AMOUNT style="currency" currency=CURRENCY /}{/currencies}',
                ctx = { 
                    currencies: [
                        { AMOUNT: 3, CURRENCY: 'USD' },
                        { AMOUNT: 8, CURRENCY: 'EUR' },
                        { AMOUNT: 10, CURRENCY: 'JPY' }
                    ]
                },
                expected = " $3.00 €8.00 ¥10";
            Dust.loadSource(Dust.compile(tmpl, name));
            Dust.render(name, ctx, function(err, out) {
                expect(out).to.equal(expected);
            });
        });

        it('should return a currency even when using a different locale', function (){
            var name = 'number9',
                tmpl = '{@intlNumber val=40000 locale="de-DE" style="currency" currency=CURRENCY/}';
            Dust.loadSource(Dust.compile(tmpl, name));
            async.series([
                function(taskDone) {
                    Dust.render(name, { CURRENCY: 'USD' }, function(err, out) {
                        expect(out, 'USD->de-DE').to.equal('40.000,00 $');
                        taskDone(err);
                    });
                },
                function(taskDone) {
                    Dust.render(name, { CURRENCY: 'EUR' }, function(err, out) {
                        expect(out, 'EUR->de-DE').to.equal('40.000,00 €');
                        taskDone(err);
                    });
                },
                function(taskDone) {
                    Dust.render(name, { CURRENCY: 'JPY' }, function(err, out) {
                        expect(out, 'JPY->de-DE').to.equal('40.000 ¥');
                        taskDone(err);
                    });
                }
            ], function(err) {
                throw err;
            });
        });
    });

    describe('used to format percentages', function () {
        it('should return a string formatted to a percent', function () {
            var name = 'number10',
                tmpl = '{@intlNumber val=400 style="percent"/}',
                ctx = {},
                expected = "40,000%";
            Dust.loadSource(Dust.compile(tmpl, name));
            Dust.render(name, ctx, function(err, out) {
                expect(out).to.equal(expected);
            });
        });

        it('should return a perctage when using a different locale', function () {
            var name = 'number11',
                tmpl = '{@intlNumber val=400 locale="de-DE" style="percent"/}',
                ctx = {},
                expected = "40.000 %";
            Dust.loadSource(Dust.compile(tmpl, name));
            Dust.render(name, ctx, function(err, out) {
                expect(out).to.equal(expected);
            });
        });
    });
});


describe('Helper `intlDate`', function () {
    it('should be added to Dust', function () {
        expect(Dust.helpers).to.include.keys('intlDate');
    });

    it('should be a function', function () {
        expect(Dust.helpers.intlDate).to.be.a('function');
    });

    it('should throw if called with out a value', function () {
        try {
            var name = 'date0',
                tmpl = '{@intlDate /}';
            Dust.loadSource(Dust.compile(tmpl, name));
            Dust.render(name);
        } catch (e) {
            var err = new ReferenceError('A date or time stamp must be provided.');
            expect(e.toString()).to.equal(err.toString());
        }
    });

    // Use a fixed known date
    var dateStr = 'Thu Jan 23 2014 18:00:44 GMT-0500 (EST)',
        timeStamp = 1390518044403;

    it('should return a formatted string (date)', function () {
        var name = 'date1',
            tmpl = '{@intlDate val="' + dateStr + '" /}',
            ctx = {},
            expected = "1/23/2014";
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });

    it('should return a formatted string (time)', function () {
        var name = 'date2',
            tmpl = '{@intlDate val=' + timeStamp + ' /}',
            ctx = {},
            expected = "1/23/2014";
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });

    /** SINGLE VALUES ARE MUTED FOR NOW :: https://github.com/andyearnshaw/Intl.js/issues/56
    it('should return a formatted string of option requested', function () {
        var name = 'date3',
            tmpl = '{@intlDate val=DATE year="numeric" /}',
            ctx = { DATE: dateStr },
            expected = "2014";
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });
    */

    it('should return a formatted string of just the time', function () {
        var name = 'date3',
            tmpl = '{@intlDate val=' + timeStamp + ' hour="numeric" minute="numeric" /}',
            ctx = {},
            expected,   // "6:00 PM" EST or "3:00 PM" PST
            d = new Date(timeStamp);
        expected = (d.getHours() - 12) + ':00 PM';  // the actual value depends on the timezone where this test is run :(
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });
});


describe('Helper `intlMessage`', function () {
    it('should be added to Dust', function () {
        expect(Dust.helpers).to.include.keys('intlMessage');
    });

    it('should be a function', function () {
        expect(Dust.helpers.intlMessage).to.be.a('function');
    });

    it('should throw if called with out a value', function () {
        try {
            var name = 'message0',
                tmpl = '{@intlMessage /}';
            Dust.loadSource(Dust.compile(tmpl, name));
            Dust.render(name);
        } catch (e) {
            var err = new ReferenceError('A message name or string must be provided.');
            expect(e.toString()).to.equal(err.toString());
        }
    });

    it('should return a formatted string', function () {
        var name = 'message1',
            tmpl = '{@intlMessage _msg=MSG firstName=firstName lastName=lastName /}',
            ctx = {
                MSG: 'Hi, my name is {firstName} {lastName}.',
                firstName: 'Anthony',
                lastName: 'Pipkin'
            },
            expected = "Hi, my name is Anthony Pipkin.";
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });

    it('should return a formatted string with formatted numbers and dates', function () {
        var name = 'message2',
            tmpl = '{@intlMessage _msg=POP_MSG city=city population=population census_date=census_date timeZone=timeZone/}',
            ctx = {
                POP_MSG: '{city} has a population of {population, number, integer} as of {census_date, date, medium}.',
                city: 'Atlanta',
                population: 5475213,
                census_date: (new Date('1/1/2010')).getTime(),
                timeZone: 'UTC'
            },
            expected = "Atlanta has a population of 5,475,213 as of Jan 1, 2010.";
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });

    it('should return a formatted string with formatted numbers and dates in a different locale', function () {
        var name = 'message3',
            tmpl = '{@intlMessage _msg=POP_MSG locale="de-DE" city=city population=population census_date=census_date timeZone=timeZone/}',
            ctx = {
                POP_MSG: '{city} has a population of {population, number, integer} as of {census_date, date, medium}.',
                city: 'Atlanta',
                population: 5475213,
                census_date: (new Date('1/1/2010')),
                timeZone: 'UTC'
            },
            expected = "Atlanta has a population of 5.475.213 as of 1. Jan. 2010.";
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });

    it('should return a formatted string with an `each` block', function () {
        var name = 'message4',
            tmpl = '{#harvest} {@intlMessage _msg=HARVEST_MSG person=person count=count /}{/harvest}',
            ctx = {
                HARVEST_MSG: '{person} harvested {count, plural, one {# apple} other {# apples}}.',
                harvest: [
                    { person: 'Allison', count: 10 },
                    { person: 'Jeremy', count: 60 }
                ]
            },
            expected = " Allison harvested 10 apples. Jeremy harvested 60 apples.";
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });
});


describe('Helper `intl`', function () {
    it('should be added to Dust', function () {
        expect(Dust.helpers).to.include.keys('intl');
    });

    it('should be a function', function () {
        expect(Dust.helpers.intl).to.be.a('function');
    });

    it('should maintain a locale', function () {
        var name = 'intl3',
            tmpl = '{@intlNumber val=NUM/} {@intl locale="de-DE"}{@intlNumber val=NUM /}{/intl} {@intlNumber val=NUM/}',
            ctx = { NUM: 40000.004 },
            expected = '40,000.004 40.000,004 40,000.004';
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });

    it('should maintain a currency', function () {
        var name = 'intl4',
            tmpl = '{@intlNumber val=NUM style="currency"/} {@intl currency="EUR"}{@intlNumber val=NUM style="currency"/}{/intl} {@intlNumber val=NUM style="currency"/}',
            ctx = { NUM: 40000.004 },
            expected = '$40,000.00 €40,000.00 $40,000.00';
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });

    it('should maintain context regardless of depth', function () {
        var name = 'intl5',
            tmpl = '{@intl locale="de-DE"}{@intl locale="en-US"}{@intlNumber val=NUM/} {/intl}{@intlNumber val=NUM/}{/intl} {@intlNumber val=NUM/}',
            ctx = { NUM: 40000.004 },
            expected = '40,000.004 40.000,004 40,000.004';
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });

    it('should provide `messages` for intlMessage', function () {
        var name = 'intl6',
            tmpl = '{@intl messages=intl.messages}{#harvest} {@intlMessage _key="HARVEST_MSG" person=person count=count /}{/harvest}{/intl}',
            ctx = {
                intl: {
                    messages: {
                        HARVEST_MSG: '{person} harvested {count, plural, one {# apple} other {# apples}}.',
                    }
                },
                harvest: [
                    { person: 'Allison', count: 1 },
                    { person: 'Jeremy', count: 60 }
                ]
            },
            expected = " Allison harvested 1 apple. Jeremy harvested 60 apples.";
        Dust.loadSource(Dust.compile(tmpl, name));
        Dust.render(name, ctx, function(err, out) {
            expect(out).to.equal(expected);
        });
    });
});


