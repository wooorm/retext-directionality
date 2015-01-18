'use strict';

/*
 * Dependencies.
 */

var direction;

direction = require('direction');

/**
 * Any change handler.
 *
 * @param {Node} parent
 */
function onchangeinside(parent) {
    var node,
        currentDirection,
        nodeDirection;

    if (!parent) {
        return;
    }

    node = parent.head;

    while (node) {
        nodeDirection = node.data.direction;

        if (nodeDirection !== 'neutral') {
            if (!currentDirection) {
                currentDirection = nodeDirection;
            } else if (nodeDirection !== currentDirection) {
                currentDirection = 'neutral';
                break;
            }
        }

        node = node.next;
    }

    parent.data.direction = currentDirection || 'neutral';

    onchangeinside(parent.parent);
}

/**
 * Handler for `insert`.
 *
 * @this {Child}
 */
function oninsert() {
    onchangeinside(this.parent);
}

/**
 * Handler for `remove`.
 *
 * @param {Parent} previousParent
 * @this {Child}
 */
function onremove(previousParent) {
    onchangeinside(previousParent);
}

/**
 * Handler for `changetext`.
 *
 * @param {string} value
 * @this {Child}
 */
function onchangetext(value) {
    var data,
        previousDirection,
        newDirection;

    data = this.data;
    previousDirection = data.direction;

    newDirection = value ? direction(value) : 'neutral';

    if (newDirection !== previousDirection) {
        data.direction = newDirection;

        onchangeinside(this.parent);
    }
}

/**
 * Define `directionality`.
 *
 * @param {Retext} retext
 */
function directionality(retext) {
    var Node;

    Node = retext.TextOM.Node;

    Node.on('changetext', onchangetext);
    Node.on('insert', oninsert);
    Node.on('remove', onremove);
}

/*
 * Expose `directionality`.
 */

module.exports = directionality;
