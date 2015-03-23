/* global dust */
'use strict';

var DustIntl = require('../../');
require('../../lib/locales.js');

// Load dust with its compiler.
global.dust = require('dustjs-linkedin/lib/server.js');
DustIntl.registerWith(dust);

require('../helpers.js');
