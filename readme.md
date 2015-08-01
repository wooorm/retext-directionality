# retext-directionality [![Build Status](https://img.shields.io/travis/wooorm/retext-directionality.svg)](https://travis-ci.org/wooorm/retext-directionality) [![Coverage Status](https://img.shields.io/codecov/c/github/wooorm/retext-directionality.svg)](https://codecov.io/github/wooorm/retext-directionality)

[**retext**](https://github.com/wooorm/retext "Retext") directionality
detection.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
npm install retext-directionality
```

**retext-directionality** is also available for [bower](http://bower.io/#install-packages),
[component](https://github.com/componentjs/component), and
[duo](http://duojs.org/#getting-started), and as an AMD, CommonJS, and globals
module, [uncompressed](retext-directionality.js) and
[compressed](retext-directionality.min.js).

## Usage

```js
var retext = require('retext');
var inspect = require('unist-util-inspect');
var direction = require('retext-directionality');

retext().use(direction).use(function () {
    return function (cst) {
        console.log(inspect(cst));
    };
}).process('A simple, Anglais, بسيطة.');
```

Yields:

```text
RootNode[1] [data={"direction":"neutral"}]
└─ ParagraphNode[1] [data={"direction":"neutral"}]
   └─ SentenceNode[10] [data={"direction":"neutral"}]
      ├─ WordNode[1] [data={"direction":"ltr"}]
      │  └─ TextNode: 'A' [data={"direction":"ltr"}]
      ├─ WhiteSpaceNode: ' ' [data={"direction":"neutral"}]
      ├─ WordNode[1] [data={"direction":"ltr"}]
      │  └─ TextNode: 'simple' [data={"direction":"ltr"}]
      ├─ PunctuationNode: ',' [data={"direction":"neutral"}]
      ├─ WhiteSpaceNode: ' ' [data={"direction":"neutral"}]
      ├─ WordNode[1] [data={"direction":"ltr"}]
      │  └─ TextNode: 'Anglais' [data={"direction":"ltr"}]
      ├─ PunctuationNode: ',' [data={"direction":"neutral"}]
      ├─ WhiteSpaceNode: ' ' [data={"direction":"neutral"}]
      ├─ WordNode[1] [data={"direction":"rtl"}]
      │  └─ TextNode: 'بسيطة' [data={"direction":"rtl"}]
      └─ PunctuationNode: '.' [data={"direction":"neutral"}]
```

## API

None, **retext-directionality** automatically detects the direction of each
[`Text`](https://github.com/wooorm/nlcst#text) (using
[**wooorm/direction**](https://github.com/wooorm/direction)), either `"ltr"`,
`"rtl"`, or `"neutral"`), and stores the direction in `node.data.direction`.

All parents (such as words, sentences, paragraphs, root) also receive a
`direction` property (`parent.data.direction`): If every
[`Text`](https://github.com/wooorm/nlcst#text) inside a parent has the same
(or neutral) direction, the parent has the same direction, otherwise, the
parent has a neutral direction.

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
