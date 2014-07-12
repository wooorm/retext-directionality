'use strict';

var directionality = require('..'),
    visit = require('retext-visit'),
    Retext = require('retext'),
    assert = require('assert');

describe('directionality()', function () {
    var tree, leftToRightWords, rightToLeftWords;

    it('should be of type `function`', function () {
        assert(typeof directionality === 'function');
    });

    tree = new Retext()
        .use(visit)
        .use(directionality)
        .parse('A simple, english, sentence.');

    // French, baguette!
    leftToRightWords = 'Un simple anglais phrase'.split(' ');

    // I'm no good at arabic—but google says this is the translation of the
    // example. For our purpose this however does not matter—we just need
    // some right-to-left words
    rightToLeftWords = 'أ الجملة الانجليزية بسيطة'.split(' ');

    it('should detect the direction of each `WordNode`', function () {
        tree.visitType(tree.WORD_NODE, function (wordNode) {
            assert('direction' in wordNode.data);
            assert(wordNode.data.direction === 'ltr');
        });

        var iterator = -1;

        tree.visitType(tree.WORD_NODE, function (wordNode) {
            wordNode[0].fromString(leftToRightWords[++iterator]);
            assert(wordNode.data.direction === 'ltr');
        });
    });

    it('should set the direction of a `WordNode` to null, when no value ' +
        'is given', function () {
            tree.visitType(tree.WORD_NODE, function (wordNode) {
                wordNode[0].fromString('');
                assert(wordNode.data.direction === 'neutral');
            });

            var iterator = -1;

            tree.visitType(tree.WORD_NODE, function (wordNode) {
                wordNode[0].fromString(leftToRightWords[++iterator]);
                assert(wordNode.data.direction === 'ltr');
            }
        );
    });

    it('should detect the direction of each `Parent`', function () {
        tree.visitType(tree.WORD_NODE, function (wordNode) {
            var parent = wordNode;

            while (parent.parent) {
                parent = parent.parent;
                assert('direction' in parent.data);
                assert(parent.data.direction === 'ltr');
            }
        });
    });

    it('should automatically redetect `WordNode`s and their parents ' +
        'when their value changes', function () {
            var iterator = -1;

            tree.visitType(tree.WORD_NODE, function (wordNode) {
                var parent = wordNode, shouldBeDirection;

                wordNode[0].fromString(rightToLeftWords[++iterator]);
                assert(wordNode.data.direction === 'rtl');

                shouldBeDirection = iterator === 3 ? 'rtl' : 'neutral';

                while (parent.parent) {
                    parent = parent.parent;
                    assert(parent.data.direction === shouldBeDirection);
                }
            });
        }
    );

    it('should automatically set previous parents direction to `"neutral"`' +
        'when all `WordNode`s are removed', function () {
            var parent = tree.head.head;

            tree.visitType(tree.TEXT_NODE, function (node) {
                node.remove();
            });

            while (parent) {
                assert(parent.data.direction === 'neutral');
                parent = parent.parent;
            }
        }
    );
});
