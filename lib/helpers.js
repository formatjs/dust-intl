/*
 * Copyright (c) 2014, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
(/* istanbul ignore next */
 function (root, factory) {
    // factory requires Intl and MessageFormat to be passed to it
    // Inlt can be the system Intl or an Intl polyfill assigned to root.Intl
    // MessageFormat can be MessageFormat on the Intl namespace or an IntlMessageFormat polyfill
    var lib = factory(root.Intl, (root.Intl && root.Intl.MessageFormat) || root.IntlMessageFormat);

    if (typeof module === 'object' && module.exports) {
        // node.js/CommonJs
        module.exports = lib;
    }
    if (typeof define === 'function' && define.amd) {
        // AMD anonymous module
        define(lib);
    }
    if (root) {
        root.DustHelperIntl = lib;
    }
})(typeof global !== 'undefined' ? global : this, function (Intl, IntlMessageFormat) {


    /* istanbul ignore if */
    if (!Intl) {
        throw new ReferenceError('Intl must be provided.');
    }

    /* istanbul ignore if */
    if (!IntlMessageFormat) {
        throw new ReferenceError('IntlMessageFormat must be provided.');
    }


    var CONTEXT_KEY = '--intl--',
        _dateTimeFormats = {},
        _numberFormats = {};


    /**
     Sets options for Intl.DateTimeFormat to a specified key. The key can then
     be used with `intlDate` as `{{intlDate format="key"}}`
     @method setDateTimeFormat
     @param {String} key
     @param {Object} options
     */
    function setDateTimeFormat(key, options) {
        _dateTimeFormats[key] = options;
    }


    /**
     Returns the DateTimeFormat options for the specified key, or null if the
     key is not found
     @method getDateTimeFormat
     @param {String} key
     @return {Object|null}
     */
    function getDateTimeFormat(key) {
        return _dateTimeFormats[key] || null;
    }


    /**
     Sets options for Intl.NumberFormat to a specified key. The key can then
     be used with `intlNum` as `{{intlNum format="key"}}`
     @method setNumberFormat
     @param {String} key
     @param {Object} options
     */
    function setNumberFormat(key, options) {
        _numberFormats[key] = options;
    }


    /**
     Returns the NumberFormat options for the specified key, or null if the
     key is not found
     @method getNumberFormat
     @param {String} key
     @return {Object|null}
     */
    function getNumberFormat(key) {
        return _numberFormats[key] || null;
    }


    /**
     Central location for helper methods to get a locale to use.  If the locale
     is in neither the params nor the context, it defaults to the global `this`.
     @protected
     @method _getLocale
     @param {Object} [params] the parameters passed to the dust helper
     @param {Object} [context] the dust helper context
     @return the locale to use
     */
    function _getLocale(params, context) {
        return params.locale || context.get([CONTEXT_KEY, 'locale']) || this.locale;
    }


    /**
     Central location for helper methods to get a currency to use.  If the currency
     is in neither the params nor the context, it defaults to the global `this`.
     @protected
     @method _getCurrency
     @param {Object} [params] the parameters passed to the dust helper
     @param {Object} [context] the dust helper context
     @return the currency to use
     */
    function _getCurrency(params, context) {
        return params.currency || context.get([CONTEXT_KEY, 'currency']) || this.currency;
    }


    /**
    Interprets `params.val` as a YRB message to format.
    @method intlMessage
    @param {Object} chunk The dust Chunk object.
    @param {Object} context The dust Context object.
    @param {Object} bodies An object containing the dust bodies.
    @param {Object} params An object containing the parameters in the markup for this helper.
    @return {Object} The `chunk` parameter.
    */
    function intlMessage(chunk, context, bodies, params) {
        var formatOptions,
            locale,
            val,
            formatter;
        params = params || {};

        if (!params.hasOwnProperty('val')) {
            throw new ReferenceError('A string must be provided.');
        }
        val = params.val;
        delete params.val;  // since params might be interpretted as format options

        formatOptions = (params.format && _numberFormats[params.format]) || params;
        locale = _getLocale(params, context);

        formatter = new IntlMessageFormat(val, locale, formatOptions);
        chunk.write(formatter.format(formatOptions));
        return chunk;
    }


    /**
    Interprets `params.val` as a number to format.
    @method intlMessage
    @param {Object} chunk The dust Chunk object.
    @param {Object} context The dust Context object.
    @param {Object} bodies An object containing the dust bodies.
    @param {Object} params An object containing the parameters in the markup for this helper.
    @return {Object} The `chunk` parameter.
    */
    function intlNumber(chunk, context, bodies, params) {
        var formatOptions,
            locale,
            val,
            formatter;
        params = params || {};

        if (!params.hasOwnProperty('val')) {
            throw new ReferenceError('A number must be provided.');
        }
        val = params.val;
        delete params.val;  // since params might be interpretted as format options

        formatOptions = (params.format && _numberFormats[params.format]) || params;
        if (!formatOptions.currency) {
            formatOptions.currency = _getCurrency(params, context);
        }
        locale = _getLocale(params, context);
        formatter = new Intl.NumberFormat(locale, formatOptions);
        chunk.write(formatter.format(val));
        return chunk;
    }


    /**
    Interprets `params.val` as a date or time to format.
    @method intlMessage
    @param {Object} chunk The dust Chunk object.
    @param {Object} context The dust Context object.
    @param {Object} bodies An object containing the dust bodies.
    @param {Object} params An object containing the parameters in the markup for this helper.
    @return {Object} The `chunk` parameter.
    */
    function intlDate(chunk, context, bodies, params) {
        var formatOptions,
            locale,
            val,
            formatter;
        params = params || {};

        if (!params.hasOwnProperty('val')) {
            throw new ReferenceError('A date or time stamp must be provided.');
        }
        val = params.val;
        delete params.val;  // since params might be interpretted as format options
        val = new Date(val).getTime();

        formatOptions = (params.format && _numberFormats[params.format]) || params;
        locale = _getLocale(params, context);
        formatter = new Intl.DateTimeFormat(locale, formatOptions);
        chunk.write(formatter.format(val));
        return chunk;
    }


    /**
    A block wrapper which stashes the `params` in the context so that
    they are available for other intl helpers within the block.
    @method intlMessage
    @param {Object} chunk The dust Chunk object.
    @param {Object} context The dust Context object.
    @param {Object} bodies An object containing the dust bodies.
    @param {Object} params An object containing the parameters in the markup for this helper.
    @return {Object} The `chunk` parameter.
    */
    function intl(chunk, context, bodies, params) {
        var ctx = {};
        if (bodies.block) {
            ctx[CONTEXT_KEY] = params || {};
            return chunk.render(bodies.block, context.push(ctx));
        }
        return chunk;
    }


    return {
        // expose the helpers individually in case someone wants to use
        // only some of them
        helpers: {
            intlMessage:    intlMessage,
            intlNumber:     intlNumber,
            intlDate:       intlDate,
            intl:           intl
        },

        // utility method to register all the helpers
        register: function(dust) {
            dust.helpers.intlMessage    = intlMessage;
            dust.helpers.intlNumber     = intlNumber;
            dust.helpers.intlDate       = intlDate;
            dust.helpers.intl           = intl;
        },

        // expose format methods
        setDateTimeFormat : setDateTimeFormat,
        getDateTimeFormat : getDateTimeFormat,
        setNumberFormat   : setNumberFormat,
        getNumberFormat   : getNumberFormat
    };
});

