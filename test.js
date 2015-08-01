'use strict';

/* eslint-env mocha */

/*
 * Dependencies.
 */

var assert = require('assert');
var retext = require('retext');
var visit = require('unist-util-visit');
var directionality = require('./');

/*
 * Fixtures.
 */

var sentence = 'A simple, Anglais, بسيطة.';

var directions = [
    'neutral', // Root
    'neutral', // Paragraph
    'neutral', // Sentence
    'ltr', // Word: 'A'
    'ltr', // Text: 'A'
    'neutral', // WhiteSpace
    'ltr', // Word: 'simple'
    'ltr', // Text: 'simple'
    'neutral', // Punctuation: ','
    'neutral', // WhiteSpace
    'ltr', // Word: 'Anglais'
    'ltr', // Text: 'Anglais'
    'neutral', // Punctuation: ','
    'neutral', // WhiteSpace
    'rtl', // Word: 'سيطة'
    'rtl', // Text: 'سيطة'
    'neutral' // Punctuation: '.'
];

/*
 * Tests.
 */

describe('directionality()', function () {
    retext().use(directionality).process(sentence, function (err, file) {
        it('should work', function (done) {
            var index = -1;

            visit(file.namespace('retext').cst, function (node) {
                assert.equal(node.data.direction, directions[++index]);
            });

            done(err);
        });
    });
});
