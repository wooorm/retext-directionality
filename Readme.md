# retext-directionality [![Build Status](https://travis-ci.org/wooorm/retext-directionality.svg?branch=master)](https://travis-ci.org/wooorm/retext-directionality) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-directionality.svg)](https://coveralls.io/r/wooorm/retext-directionality?branch=master)

**[retext](https://github.com/wooorm/retext "Retext")** directionality detection.

## Installation

NPM:
```sh
$ npm install retext-directionality
```

Component.js:
```sh
$ component install wooorm/retext-directionality
```

## Usage

```js
var Retext = require('retext'),
    visit = require('retext-visit'),
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
None, the plugin automatically detects the direction (either `"ltr"`, `"rtl"`, or `"neutral"`) of each text node when its created, changed, or removed, and stores that direction in `data.direction` on the node. If every text node inside a parent has the same direction, the parent has the same direction, otherwise, the parent has a neutral direction.

## License

MIT © Titus Wormer
