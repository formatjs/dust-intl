dust-helper-intl
================

Dust helpers for internationalization.

[![Build Status](https://travis-ci.org/yahoo/dust-helper-intl.png?branch=master)](https://travis-ci.org/yahoo/dust-helper-intl)


## Installation


### Browser

1. Install with [bower](http://bower.io/): `bower install dust-helper-intl`
2. Load the scripts into your page. (It does not matter which order the scripts are loaded in.)

    ```html
    <script src="dustjs-linkedin.js"></script>
    <script src="dust-helper-intl.js"></script>
    ```

3. Register the helpers:

    ```javascript
    DustHelperIntl.register(dust);
    ```


### Node/CommonJS

1. You can install the helpers with npm: `npm install dust-helper-intl`
2. Load in the module and register it:

    ```javascript
    var Dust = require('dustjs-linkedin');
    global.Intl = require('intl');
    require('dust-helper-intl').register(Dust);
    ```

    **NOTE:**  Since node (as of 0.10) doesn't provide the global `Intl` object
    (ECMA-402) you'll need to provide a polyfill.  The `intl` NPM package can
    provide this or you can use another.


### AMD

1. Install with [bower](http://bower.io/): `bower install dust-form-helpers`
3. Load in the module and register it:

    ```javascript
    define(['dust', 'dust-helper-intl'], function(Dust, DustHelperIntl) {
        DustHelperIntl.register(Dust);
    });
    ```


## Usage

TODO




