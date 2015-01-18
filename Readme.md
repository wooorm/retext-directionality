# retext-directionality [![Build Status](https://img.shields.io/travis/wooorm/retext-directionality.svg?style=flat)](https://travis-ci.org/wooorm/retext-directionality) [![Coverage Status](https://img.shields.io/coveralls/wooorm/retext-directionality.svg?style=flat)](https://coveralls.io/r/wooorm/retext-directionality?branch=master)

[**retext**](https://github.com/wooorm/retext "Retext") directionality detection.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install retext-directionality
```

[Component.js](https://github.com/componentjs/component):

```bash
$ component install wooorm/retext-directionality
```

[Bower](http://bower.io/#install-packages):

```bash
$ bower install retext-directionality
```

[Duo](http://duojs.org/#getting-started):

```javascript
var directionality = require('wooorm/retext-directionality');
```

## Usage

```javascript
var Retext = require('retext');
var visit = require('retext-visit');
var inspect = require('retext-inspect');
var directionality = require('retext-directionality');

var retext = new Retext()
    .use(inspect)
    .use(visit)
    .use(directionality);

retext.parse('A simple, anglais, بسيطة.', function (err, tree) {
    /* Log the tree, note the data attributes: */
    console.log(tree);
    /*
     * RootNode[1] [data={"direction":"neutral"}]
     * └─ ParagraphNode[1] [data={"direction":"neutral"}]
     *    └─ SentenceNode[10] [data={"direction":"neutral"}]
     *       ├─ WordNode[1] [data={"direction":"ltr"}]
     *       │  └─ TextNode: 'A' [data={"direction":"ltr"}]
     *       ├─ WhiteSpaceNode: ' ' [data={"direction":"neutral"}]
     *       ├─ WordNode[1] [data={"direction":"ltr"}]
     *       │  └─ TextNode: 'simple' [data={"direction":"ltr"}]
     *       ├─ PunctuationNode: ',' [data={"direction":"neutral"}]
     *       ├─ WhiteSpaceNode: ' ' [data={"direction":"neutral"}]
     *       ├─ WordNode[1] [data={"direction":"ltr"}]
     *       │  └─ TextNode: 'anglais' [data={"direction":"ltr"}]
     *       ├─ PunctuationNode: ',' [data={"direction":"neutral"}]
     *       ├─ WhiteSpaceNode: ' ' [data={"direction":"neutral"}]
     *       ├─ WordNode[1] [data={"direction":"rtl"}]
     *       │  └─ TextNode: 'بسيطة' [data={"direction":"rtl"}]
     *       └─ PunctuationNode: '.' [data={"direction":"neutral"}]
     */
});
```

## API

None, **retext-directionality** automatically detects the direction of each [`Text`](https://github.com/wooorm/textom#textomtextvalue-nlcsttext) (using **[wooorm/direction](https://github.com/wooorm/direction)**), either `"ltr"`, `"rtl"`, or `"neutral"`), and stores the direction in `node.data.direction`.

All parents (such as words, sentences, paragraphs, root) also receive a `direction` property (`parent.data.direction`): If every [`Text`](https://github.com/wooorm/textom#textomtextvalue-nlcsttext) inside a parent has the same (or neutral) direction, the parent has the same direction, otherwise, the parent has a neutral direction.

## Performance

On a MacBook Air, **retext** performs about 27% slower with **retext-directionality**.

```text
           retext w/o retext-directionality
  228 op/s » A paragraph (5 sentences, 100 words)
   25 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)

           retext w/ retext-directionality
  166 op/s » A paragraph (5 sentences, 100 words)
   18 op/s » A section (10 paragraphs, 50 sentences, 1,000 words)
```

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
