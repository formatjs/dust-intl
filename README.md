Dust Intl
=========

Dust helpers for internationalization.

[![npm Version][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Dependency Status][david-badge]][david]

[![Sauce Test Status](https://saucelabs.com/browser-matrix/dust-intl.svg)](https://saucelabs.com/u/dust-intl)

Overview
--------

### Goals

* Integrate internationalization features with [Dust][] to lower the barrier for localizing Dust templates.

* Build on current and emerging JavaScript [`Intl`][Intl] standards — architect in a future-focused way. Leverage industry standards used in other programming langages like [CLDR][] locale data, and [ICU Message syntax][ICU].

* Run in both Node.js and in the browser with a single `<script>` element.

### How It Works

**Template Source:**

```dust
<b>Price:</b> {@formatNumber val=price style="currency" currency="USD"/}
```

**Render Template:**

```js
var context = {
    intl: {
        locales: 'en-US'
    },
    price: 1000
};

dust.renderSource(template, context, function(err, html) {
    console.log(html);
});
```

**Output:**

```html
<b>Price:</b> $1,000.00
```


### Features

* Formats **numbers** and **dates/times**, including those in complex messages using the JavaScript built-ins: [`Intl.NumberFormat`][Intl-NF] and [`Intl.DateTimeFormat`][Intl-DTF], respectively.

* Formats **relative times** (e.g., "3 hours ago") using the [Intl RelativeFormat][Intl-RF] library which uses [CLDR][] locale data.

* Formats complex messages, including **plural** and **select** arguments using the [Intl MessageFormat][Intl-MF] library which uses [CLDR][] locale data and works with [ICU Message syntax][ICU].


Usage
-----


### `Intl` Dependency

This package assumes that the [`Intl`][Intl] global object exists in the runtime.
`Intl` is present in all modern browsers _except_ Safari, and there's work happening to [integrate `Intl` into Node.js][Intl-Node].

**Luckly, there's the [Intl.js][] polyfill!** You will need to conditionally load the polyfill if you want to support runtimes which `Intl` is not already built-in.


#### Loading Intl.js Polyfill in a browser

If the browser does not already have the `Intl` APIs built-in, the Intl.js Polyfill will need to be loaded on the page along with the locale data for any locales that need to be supported:

```html
<script src="intl/Intl.min.js"></script>
<script src="intl/locale-data/jsonp/en-US.js"></script>
```

_Note: Modern browsers already have the `Intl` APIs built-in, so you can load the Intl.js Polyfill conditionally, by for checking for `window.Intl`._

#### Loading Intl.js Polyfill in Node.js

Conditionally require the Intl.js Polyfill if it doesn't already exist in the runtime. As of Node <= 0.10, this polyfill will be required.

```js
if (!global.Intl) {
    require('intl');
}
```

_Note: When using the Intl.js Polyfill in Node.js, it will automatically load the locale data for all supported locales._


### Registering Helpers in a Browser

First, load Dust and this package onto the page:

```html
<script src="dustjs/dust-core.min.js"></script>
<script src="dust-intl/dust-intl.min.js"></script>
```

By default, Handlebars Intl ships with the locale data for English built-in to the runtime library. When you need to format data in another locale, include its data; e.g., for French:

```html
<script src="dust-intl/locale-data/fr.js"></script>
```

_Note: All 150+ locales supported by this package use their root BCP 47 langage tag; i.e., the part before the first hyphen (if any)._

Then, register the helpers with Dust:

```js
DustIntl.registerWith(Dust);
```

This package will create the `DustIntl` global that has the `registerWith()` function.


### Registering Helpers in Node.js

Import Dust and this package, then register the Intl helpers with Dust:

```js
var Dust     = require('dustjs-linkedin'),
    DustIntl = require('dust-helper-intl');

DustIntl.registerWith(Dust);
```

_Note: in Node.js, the data for all 150+ locales is pre-loaded._


### Supplying i18n Data to Dust

Dust has just the **context** in which to pass all information.
This package looks in the `intl` key in the context for the i18n used by the helpers.


#### `context.intl.locales`

A string with a BCP 47 language tag, or an array of such strings; e.g., `"en-US"`.
If you do not provide a locale, the default locale will be used, but you should _always_ provide one!

This value is used by the helpers when constructing the underlying formatters.


#### `context.intl.messages`

This is an object the keys of which identify messages and the values are the messages themselves.
These messages are referenced by the `_key` parameter of the `{@intlMessage}` helper.
One common use is to put complex message strings here.
The strings should be appropriate for the locale specified by `context.intl.locales`.

**Note:** These messages _need_ to follow the [ICU Message][ICU] standard.
Luckily this is a common standard that professional translators should already be familiar with.

```js
// Static collection of messages, per-locale.
var MESSAGES = {
    foo: '{hostName} hosted the party!',
    bar: 'Pets? We have: {numPets, number, integer}',
    ...
}
```

These statically defined message strings can be provided to dust via `context.intl.messages`:

```js
// Supply the intl data as part of the context.
var context = {
    intl: {
        locales: 'en-US',
        messages: MESSAGES
    },
    ...
};

Dust.renderSource(template, context, function(err, html) {
    console.log(html);
});
```


#### `context.intl.formats`

Object with user defined options for format styles.
This is used to supply custom format styles and is useful you need supply a set of options to the underlying formatter; e.g., outputting a number in USD:

```js
{
    number: {
        USD: {
            style   : 'currency',
            currency: 'USD'
        }
    },

    date    : {...},
    time    : {...},
    relative: {...}
}
```

These pre-defined formats map to their respective helpers of the same type, and all `context.intl.formats` are used by the `{@formatNumber}`, `{@formatDate}`, and `{@formatTime}` helpers.
They can then be used by String name/path like this:

```dust
{@formatNumber val=100 formatName="USD"/}
```


### Helpers


#### `{@intl}`

Block helper used to create a new `intl` data scope by updating the [i18n data supplied to Dust](#supplying-i18n-data-to-dust) within the block.
This is useful when you need to render part of the page in a particular locale, or need to supply the i18n data to Dust via the template context.

The following example uses `{@intl}` to set the locale to French and will output `"1 000"`:

```dust
{@intl locales="fr-FR"}
    {@formatNumber val=1000/}
{/intl}
```


#### `{@formatDate}`

Formats dates using [`Intl.DateTimeFormat`][Intl-DTF], and returns the formatted string value.

```dust
{@formatDate val=now weekday="long" timeZone="UTC"/}
```

```js
var context = {
    intl: {
        locales: 'en-US'
    },
    now: Date.now(),
};

Dust.renderSource(template, context, function(err, html) {
    console.log(html); // => "Tuesday, August 12, 2014"
});
```

**Parameters:**

* `val`: `Date` instance or `String` timestamp to format.

* `[format]`: Optional String path to a predefined format on [`context.intl.formats`](#contextintlformats). The format's values are merged with other parameters.

Other parameters passed to this helper become the `options` argument when the [`Intl.DateTimeFormat`][Intl-DTF] instance is created.


#### `{@formatTime}`

This delegates to the `{@formatDate}` helper, but first it will reference any `formatName` from [`context.intl.formats.time`](#contextintlformats).


#### `{@formatRelative}`

TODO


#### `{@formatNumber}`

Formats numbers using [`Intl.NumberFormat`][Intl-NF] and returns the formatted string value.

```dust
{@formatNumber val=price style="currency" currency="USD"/}
```

```js
var context = {
    intl: {
        locales: 'en-US'
    },
    price = 100
};

Dust.renderSource(template, context, function(err, html) {
    console.log(html); // => "$100.00"
});
```

**Parameters:**

* `val`: `Number` to format.

* `[format]`: Optional String path to a predefined format on [`context.intl.formats`](#contextintlformats). The format's values are merged with other parameters.

Other parameters passed to this helper become the `options` argument when the [`Intl.NumberFormat`][Intl-NF] instance is created.


#### `{@formatMessage}`

Formats [ICU Message][ICU] strings with the given values supplied as the hash arguments.

```
You have {numPhotos, plural,
    =0 {no photos.}
    =1 {one photo.}
    other {# photos.}}
```

```dust
{@formatMessage _key="photos" numPhotos=numPhotos/}
```

```js
var context = {
    intl: {
        locales: 'en-US',
        messages: {
            photos: '...', // String from code block above.
            ...
        },
        numPhotos: 1
    }
};

Dust.renderSource(template, context, function(err, html) {
    console.log(html); // => "You have one photo."
});
```

**Parameters:**

The parameters represent the name/value pairs that are used to format the message by providing values for its argument placeholders.
A few parameters have special meaning and are used by this helper.

* `_msg`: `String` message or [`IntlMessageFormat`][Intl-MF] instance to format with the given parameters as the values.

* `_key`: `String` to lookup the message in [`context.intl.messages`](#contextintlmessages).

**Note:** It is recommended to use `_key` instead of including the literal message string in the template.



License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][LICENSE] for license text and copyright information.


[npm]: https://www.npmjs.org/package/dust-helper-intl
[npm-badge]: https://img.shields.io/npm/v/dust-helper-intl.svg?style=flat
[travis]: https://travis-ci.org/yahoo/dust-helper-intl
[travis-badge]: http://img.shields.io/travis/yahoo/dust-helper-intl.svg?style=flat
[david]: https://david-dm.org/yahoo/dust-helper-intl
[david-badge]: https://img.shields.io/david/yahoo/dust-helper-intl.svg?style=flat
[Dust]: http://linkedin.github.io/dustjs/
[Intl-MF]: https://github.com/yahoo/intl-messageformat
[Intl]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
[Intl-NF]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
[Intl-DTF]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
[ICU]: http://userguide.icu-project.org/formatparse/messages
[CLDR]: http://cldr.unicode.org/
[Intl.js]: https://github.com/andyearnshaw/Intl.js
[Intl-Node]: https://github.com/joyent/node/issues/6371
[LICENSE]: https://github.com/yahoo/dust-helper-intl/blob/master/LICENSE
