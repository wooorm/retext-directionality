# retext-directionality [![Build Status](https://travis-ci.org/wooorm/retext-directionality.svg?branch=master)](https://travis-ci.org/wooorm/retext-directionality) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-directionality.svg)](https://coveralls.io/r/wooorm/retext-directionality?branch=master)

[**retext**](https://github.com/wooorm/retext "Retext") directionality detection.

## Installation

npm:
```sh
$ npm install retext-directionality
```

Component:
```sh
$ component install wooorm/retext-directionality
```

Bower:
```sh
$ bower install retext-directionality
```

## Usage

```js
var Retext = require('retext'),
    visit = require('retext-visit'),
    directionality = require('retext-directionality'),
    retext

retext = new Retext()
    .use(visit)
    .use(directionality);

retext.parse('A simple, anglais, بسيطة.', function (err, tree) {
    tree.visitType(tree.WORD_NODE, function (node) {
        console.log(node.toString(), node.data.direction);
    });
    /**
     * "A", "ltr"
     * "simple", "ltr"
     * "anglais", "ltr"
     * "بسيطة", "rtl"
     *
     */

    console.log(tree.toString(), tree.data.direction);
    /* "A simple, anglais, بسيطة". neutral */
});
```

This example also uses [retext-visit](https://github.com/wooorm/retext-visit).

## API

None, the plugin automatically detects the direction (either `"ltr"`, `"rtl"`, or `"neutral"`) of each text node when its created, changed, or removed, and stores that direction in `data.direction` on the node. If every text node inside a parent has the same (or neutral) direction, the parent has the same direction, otherwise, the parent has a neutral direction.

## License

MIT © Titus Wormer
