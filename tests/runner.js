/* global Intl, IntlPolyfill, dust */
/* jshint node:true */
'use strict';

// Force use of Intl.js Polyfill to serve as a mock.
require('intl');
Intl.NumberFormat   = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

global.IntlMessageFormat = require('intl-messageformat');
global.dust              = require('dustjs-linkedin');
global.async             = require('async');
global.expect            = require('expect.js');

require('../').registerWith(dust);

require('./helpers');
