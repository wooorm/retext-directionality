# retext-directionality [![Build Status](https://travis-ci.org/wooorm/retext-directionality.svg?branch=master)](https://travis-ci.org/wooorm/retext-directionality) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-directionality.svg)](https://coveralls.io/r/wooorm/retext-directionality?branch=master)

[![browser support](https://ci.testling.com/wooorm/retext-directionality.png) ](https://ci.testling.com/wooorm/retext-directionality)

See [Browser Support](#browser-support) for more information (a.k.a. don’t worry about those grey icons above).

---

**[retext](https://github.com/wooorm/retext "Retext")** directionality detection.

## Installation

```sh
$ npm install retext-directionality
```

## Usage

```js
var Retext = require('retext'),
    visit = require('retext-visit');
    directionality = require('retext-directionality');

var root = new Retext()
    .use(visit)
    .use(directionality)
    .parse('A simple, anglais, بسيطة.');

root.visitType(root.WORD_NODE, function (node) {
    console.log(node.toString(), node.data.direction);
});
// "A" ltr
// "simple" ltr
// "anglais" ltr
// "بسيطة" rtl

console.log(root.toString(), root.data.direction);
// "A simple, anglais, بسيطة". neutral
```

This example also uses [retext-visit](https://github.com/wooorm/retext-visit).

## API
None, the plugin automatically detects the direction (either `"lrt"`, `"rtl"`, or `"neutral"`) of each word when its created or changed, stores that direction in `data.direction` on the word node and all its parents.

## Browser Support
Pretty much every browser (available through browserstack) runs all retext-directionality unit tests.

## License

  MIT
