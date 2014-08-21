/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jshint esnext: true */

import {
    getDateTimeFormat,
    getNumberFormat,
    getMessageFormat
} from 'intl-format-cache';

import {
    extend,
    contextGet,
    getFormatOptions,
    getLocales,
    tap
} from './utils';

export {registerWith};

// -----------------------------------------------------------------------------

function registerWith (dust) {
    extend(dust.helpers, {
        intl         : intl,
        formatDate   : formatDate,
        formatTime   : formatTime,
        formatNumber : formatNumber,
        formatMessage: formatMessage
    });

    // Deprecated helpers (renamed):
    extend(dust.helpers, {
        intlDate   : deprecate('intlDate', formatDate),
        intlTime   : deprecate('intlTime', formatTime),
        intlNumber : deprecate('intlNumber', formatNumber),
        intlMessage: deprecate('intlMessage', formatMessage)
    });
}

function deprecate(name, suggestion) {
    return function () {
        console.warn('{@' + name + '} is deprecated, use: {@' + suggestion.name + '}');
        return suggestion.apply(this, arguments);
    };
}

// -- Helpers ------------------------------------------------------------------

/**
A block wrapper which stashes the `params` in the context so that
they are available for other intl helpers within the block.
@method intl
@param {Object} chunk The dust Chunk object.
@param {Object} context The dust Context object.
@param {Object} bodies An object containing the dust bodies.
@param {Object} params An object containing the parameters in the markup for this helper.
@return {Object} The `chunk` parameter.
*/
function intl(chunk, context, bodies, params) {
    var ctx = {};
    if (bodies.block) {
        ctx.intl = params || {};
        return chunk.render(bodies.block, context.push(ctx));
    }
    return chunk;
}


/**
Interprets `params.val` as a date or time to format.
@method formatDate
@param {Object} chunk The dust Chunk object.
@param {Object} context The dust Context object.
@param {Object} bodies An object containing the dust bodies.
@param {Object} params An object containing the parameters in the markup for this helper.
@return {Object} The `chunk` parameter.
*/
function formatDate(chunk, context, bodies, params) {
    var formatOptions,
        locales,
        val,
        formatter;
    params = params || {};

    if (!params.hasOwnProperty('val')) {
        throw new ReferenceError('@formatDate needs a `val` parameter');
    }
    val = tap(params.val, chunk, context);
    delete params.val;  // since params might be interpretted as format options
    val = new Date(val).getTime();

    formatOptions = getFormatOptions('date', chunk, params, context);
    locales = getLocales(chunk, params, context);
    formatter = getDateTimeFormat(locales, formatOptions);
    chunk.write(formatter.format(val));
    return chunk;
}


/**
Interprets `params.val` as a date or time to format.
@method formatTime
@param {Object} chunk The dust Chunk object.
@param {Object} context The dust Context object.
@param {Object} bodies An object containing the dust bodies.
@param {Object} params An object containing the parameters in the markup for this helper.
@return {Object} The `chunk` parameter.
*/
function formatTime(chunk, context, bodies, params) {
    var formatOptions,
        locales,
        val,
        formatter;
    params = params || {};

    if (!params.hasOwnProperty('val')) {
        throw new ReferenceError('@formatTime needs a `val` parameter');
    }
    val = tap(params.val, chunk, context);
    delete params.val;  // since params might be interpretted as format options
    val = new Date(val).getTime();

    formatOptions = getFormatOptions('time', chunk, params, context);
    locales = getLocales(chunk, params, context);
    formatter = getDateTimeFormat(locales, formatOptions);
    chunk.write(formatter.format(val));
    return chunk;
}


/**
Interprets `params.val` as a number to format.
@method formatNumber
@param {Object} chunk The dust Chunk object.
@param {Object} context The dust Context object.
@param {Object} bodies An object containing the dust bodies.
@param {Object} params An object containing the parameters in the markup for this helper.
@return {Object} The `chunk` parameter.
*/
function formatNumber(chunk, context, bodies, params) {
    var formatOptions,
        locales,
        val,
        formatter;
    params = params || {};

    if (!params.hasOwnProperty('val')) {
        throw new ReferenceError('@formatNumber needs a `val` parameter');
    }
    val = tap(params.val, chunk, context);
    delete params.val;  // since params might be interpretted as format options

    formatOptions = getFormatOptions('number', chunk, params, context);
    locales = getLocales(chunk, params, context);
    formatter = getNumberFormat(locales, formatOptions);
    chunk.write(formatter.format(val));
    return chunk;
}


/**
Interprets `params.val` as a YRB message to format.
@method formatMessage
@param {Object} chunk The dust Chunk object.
@param {Object} context The dust Context object.
@param {Object} bodies An object containing the dust bodies.
@param {Object} params An object containing the parameters in the markup for this helper.
@return {Object} The `chunk` parameter.
*/
function formatMessage(chunk, context, bodies, params) {
    var formatOptions = {},
        locales,
        msg,
        formatter;
    params = params || {};

    if (params.hasOwnProperty('_msg')) {
        msg = params._msg;
    }
    else if (params._key) {
        msg = contextGet(context, ['intl', 'messages', tap(params._key, chunk, context)]);
    }
    else {
        throw new ReferenceError('@formatMessage needs either a `_msg` or `_key` parameter');
    }

    // optimization for messages that have already been compiled
    if ('object' === typeof msg && 'function' === typeof msg.format) {
        chunk.write(msg.format(params));
        return chunk;
    }

    formatOptions = contextGet(context, ['intl', 'formats']);
    locales = getLocales(chunk, params, context);
    formatter = getMessageFormat(msg, locales, formatOptions);
    chunk.write(formatter.format(params));
    return chunk;
}
