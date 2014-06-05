# retext-directionality [![Build Status](https://travis-ci.org/wooorm/retext-directionality.png)](https://travis-ci.org/wooorm/retext-directionality)

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

## License

  MIT
