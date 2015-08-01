/**
 * @author Titus Wormer
 * @copyright 2014-2015 Titus Wormer
 * @license MIT
 * @module retext:directionality
 * @fileoverview Detect directionality with Retext.
 */

'use strict';

/*
 * Dependencies.
 */

var direction = require('direction');
var visit = require('unist-util-visit');
var nlcstToString = require('nlcst-to-string');

/**
 * Patch a `direction` property on `node`s with a value.
 *
 * @param {NLCSTNode} node - Node.
 * @param {string} direction - `'rtl'`, `'ltr'`, or `'neutral'`.
 */
function patch(node, direction) {
    var data = node.data || {};

    data.direction = direction;

    node.data = data;
}

/**
 * Patch a `direction` property on `node`s with a value.
 *
 * @param {NLCSTNode} node - Node.
 */
function any(node) {
    if ('value' in node) {
        patch(node, direction(nlcstToString(node)));
    }
}

/**
 * Factory to gather parents and patch them based on their
 * childrens directionality.
 *
 * @return {function(node, index, parent)} - Can be passed
 *   to `visit`.
 */
function concatenateFactory() {
    var queue = [];

    /**
     * Gather a parent if not already gathered..
     *
     * @param {NLCSTChildNode} node - Child.
     * @param {number} index - Position of `node` in
     *   `parent`.
     * @param {NLCSTParentNode} parent - Parent of `child`.
     */
    function concatenate(node, index, parent) {
        if (parent && queue.indexOf(parent) === -1) {
            queue.push(parent);
        }
    }

    /**
     * Patch one parent. Expects all its children to have a
     * direction property already when applicable.
     *
     * @param {NLCSTParentNode} node - Parent
     * @return {string} - `'rtl'`, `'ltr'`, or `'neutral'`.
     */
    function one(node) {
        var children = node.children;
        var length = children.length;
        var index = -1;
        var child;
        var direction;
        var current;

        while (++index < length) {
            child = children[index];
            direction = child.data && child.data.direction;

            if (direction && direction !== 'neutral') {
                if (!current) {
                    current = direction;
                } else if (direction !== current) {
                    current = 'neutral';

                    break;
                }
            }
        }

        return current || 'neutral';
    }

    /**
     * Patch all parents in reverse order: this means
     * that first the last and deepest parent is invoked
     * up to the first and highest parent.
     */
    function done() {
        var index = queue.length;

        while (index--) {
            patch(queue[index], one(queue[index]));
        }
    }

    concatenate.done = done;

    return concatenate;
}

/**
 * Transformer.
 *
 * @param {NLCSTNode} cst - Syntax tree.
 */
function transformer(cst) {
    var concatenate = concatenateFactory();

    visit(cst, any);
    visit(cst, concatenate);

    concatenate.done();
}

/**
 * Attacher.
 *
 * @return {Function} - `transformer`.
 */
function attacher() {
    return transformer;
}

/*
 * Expose.
 */

module.exports = attacher;
