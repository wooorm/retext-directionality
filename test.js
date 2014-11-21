'use strict';

/**
 * Dependencies.
 */

var Retext,
    directionality,
    visit,
    inspect,
    content,
    assert;

Retext = require('retext');
directionality = require('./');
visit = require('retext-visit');
content = require('retext-content');
inspect = require('retext-inspect');
assert = require('assert');

/**
 * Fixtures.
 */

var sentence,
    leftToRightWords,
    rightToLeftWords;

/**
 * Base English sentence.
 */

sentence = 'A simple, english, sentence.';

/**
 * French, baguette!
 */

leftToRightWords = 'Un simple anglais phrase'.split(' ');

/**
 * Arabic.
 *
 * I'm no good at Aabic---but Google says this is the
 * translation of the example. For our purpose validity
 * however does not matter---we just need some
 * right-to-left words.
 */

rightToLeftWords = 'أ الجملة الانجليزية بسيطة'.split(' ');

/**
 * Retext
 */

var retext;

retext = new Retext()
    .use(inspect)
    .use(visit)
    .use(content)
    .use(directionality);

/**
 * Tests
 */

describe('directionality()', function () {
    it('should be a `function`', function () {
        assert(typeof directionality === 'function');
    });

    retext.parse(sentence, function (err, tree) {
        it('should not throw', function (done) {
            done(err);
        });

        it('should process each `WordNode`', function () {
            var index;

            tree.visit(tree.WORD_NODE, function (node) {
                assert(node.data.direction === 'ltr');
            });

            /**
             * Cover some optimizations: when a node's
             * direction does not change, there is no
             * need to re-process parents.
             */

            index = -1;

            tree.visit(tree.WORD_NODE, function (node) {
                node[0].fromString(leftToRightWords[++index]);

                assert(node.data.direction === 'ltr');
            });
        });

        it('should process each `Parent`', function () {
            tree.visit(tree.WORD_NODE, function (node) {
                var parent;

                parent = node.parent;

                while (parent) {
                    assert(parent.data.direction === 'ltr');

                    parent = parent.parent;
                }
            });
        });

        it('should set each `direction` to `null` when a `WordNode` (no ' +
            'longer?) has a value',
            function () {
                tree.visit(tree.WORD_NODE, function (node) {
                    /**
                     * We use the less secure `fromString`
                     * on a TextNode here to test for
                     * `changetext` events.
                     */

                    node[0].fromString('');

                    assert(node.data.direction === 'neutral');
                });
            }
        );

        it('should re-process each `WordNode` and `Parent`', function () {
            var index;

            /**
             * First set some left-to-rigth words, so we
             * can check for `neutral` changes.
             */

            index = -1;

            tree.visit(tree.WORD_NODE, function (node) {
                node.replaceContent(leftToRightWords[++index]);

                assert(node.data.direction === 'ltr');
            });

            index = -1;

            tree.visit(tree.WORD_NODE, function (node) {
                var parent,
                    shouldBeDirection;

                node.replaceContent(rightToLeftWords[++index]);

                assert(node.data.direction === 'rtl');

                /**
                 * When all words are `rtl`, the parent
                 * should reflext this instead of showing
                 * `neutral`.
                 */

                shouldBeDirection = index === 3 ? 'rtl' : 'neutral';

                parent = node.parent;

                while (parent) {
                    assert(parent.data.direction === shouldBeDirection);

                    parent = parent.parent;
                }
            });
        });

        it('should set `Parent`s `direction` to `neutral` when all its ' +
            '`WordNode`s are removed',
            function () {
                var parent;

                parent = tree.head.head;

                tree.visit(tree.TEXT_NODE, function (node) {
                    node.remove();
                });

                while (parent) {
                    assert(parent.data.direction === 'neutral');

                    parent = parent.parent;
                }
            }
        );
    });
});
