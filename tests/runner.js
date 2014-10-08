require('intl');

// load in message format
global.IntlMessageFormat  = require('intl-messageformat');
global.IntlRelativeFormat = require('intl-relativeformat');

global.dust   = require('dustjs-linkedin');
global.async  = require('async');
global.expect = require('expect.js');

require('../').registerWith(dust);

require('./helpers');
