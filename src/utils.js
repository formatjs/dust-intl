/*
Copyright (c) 2014, Yahoo! Inc. All rights reserved.
Copyrights licensed under the New BSD License.
See the accompanying LICENSE file for terms.
*/

/* jshint esnext: true */

export {
    assertIsDate,
    extend,
    contextGet,
    getFormatOptions,
    getLocales,
    tap
};

// -----------------------------------------------------------------------------

/**
 Asserts whether the value is a valid date or timestamp.
 @protected
 @method assertIsDate
 @param {Date|Number} date The date or number value to check.
 @return {Boolean} whether the `date` is valid, will through if not.
 */
function assertIsDate(date, errMsg) {
    // Determine if the `date` is valid by checking if it is finite, which is
    // the same way that `Intl.DateTimeFormat#format()` checks.
    if (!isFinite(date)) {
        throw new TypeError(errMsg);
    }

    return true;
}

/**
 shallow merge of keys from one object to another
 @protected
 @method _extend
 @param {Object} receiver The object which will receive the keys and values.
 @param {Object} sender The object which is providing the keys and values.
 @return {Object} The `receiver` object.
 */
function extend(receiver, sender) {
    var p;
    for (p in sender) {
        if (sender.hasOwnProperty(p)) {
            receiver[p] = sender[p];
        }
    }
    return receiver;
}


/**
 Returns something from deep within the a value in the context, taking into
 consideration the context stack.  (The built-in version of context.get()
 isn't quite sophisticated enough for us.)
 @protected
 @method contextGet
 @param {Object} ctx The dust context.
 @param {Array} keys An ordered list of keys to drill down into the data structure.
 @return {mixed} Value found for the key path, or undefined if not found.
 */
function contextGet(ctx, keys) {
    var frame,  // the current stack frame
        value;

    // search up the stacks
    for (frame = ctx.stack; frame; frame = frame.tail) {
        // finding the ordered keys in current stack frame
        value = getResult(frame.head, keys);

        // found the ordered keys path in current stack, use that
        if (value !== undefined) {
            break;
        }
    }

    // can't find the keys in context stacks, try context global
    if (value === undefined) {
        value = getResult(ctx.global, keys);
    }

    return value;
}


/**
 Determines the format options, possibly looking in parent contexts
 if they've been defined there.
 @protected
 @method getFormatOptions
 @param {Object} params The parameters passed to the dust helper.
 @param {Object} context The dust context stack.
 @return {Object} The format options.
 */
function getFormatOptions(type, chunk, params, context) {
    var raw,
        k,
        fixed = {},
        fmt;
    if (params.formatName) {
        fmt = tap(params.formatName, chunk, context);
        delete params.formatName;
        raw = contextGet(context, ['intl', 'formats', type, fmt]);
        // TODO:  only need to copy-and-merge if there are still parameters
        raw = extend({}, raw);  // shallow copy
        extend(raw, params);
    }
    else {
        raw = params;
    }
    for (k in raw) {
        if (raw.hasOwnProperty(k)) {
            fixed[k] = tap(raw[k], chunk, context);
        }
    }
    return fixed;
}


/**
 Determins the current locales, possibly looking in parent contexts
 if they've been defined there.  Defaults to the global `this`.
 @protected
 @method getLocales
 @param {Object} [params] the parameters passed to the dust helper
 @param {Object} [context] the dust helper context
 @return {string} the locale to use
 */
function getLocales(chunk, params, context) {
    if (params.locales) {
        return tap(params.locales, chunk, context);
    }
    return contextGet(context, ['intl', 'locales']);
}


// a copy of dust.helpers.tap from dustjs-helpers@1.1.2
function tap(input, chunk, context) {
    // return given input if there is no dust reference to resolve
    var output = input;
    // dust compiles a string/reference such as {foo} to function,
    if (typeof input === 'function') {
        // just a plain function (a.k.a anonymous functions) in the context, not a dust `body` function created by the dust compiler
        if (input.isFunction === true) {
            output = input();
        } else {
            output = '';
            chunk.tap(function(data) {
                output += data;
                return '';
            }).render(input, context).untap();
            if (output === '') {
                output = false;
            }
        }
    }
    return output;
}

// -- Internal -----------------------------------------------------------------

/**
 Returns value from the data using ordered list of keys
 @protected
 @method getResult
 @param {Object} data   The dust context stack's head.
 @param {Array} keys    An ordered list of keys to drill down into the data structure.
 @return {mixed}        Value found for the key path, or undefined if not found.
 */
function getResult(data, keys) {
    var k,
        last = keys.length - 1,
        key;

    // iterate the ordered keys (e.g.
    // keys = [ 'intl', 'locales' ]
    // it expects to get intl.locales in the current data stack
    for (k = 0; k < last; k += 1) {
        key = keys[k];
        if (! data) {
            break;
        }
        if (! data.hasOwnProperty(key)) {
            break;
        }
        data = data[key];
    }
    if (k === last && data && data.hasOwnProperty(keys[last])) {
        return data[keys[last]];
    }

    return undefined;
}
