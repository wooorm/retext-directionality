'use strict';

var direction = require('direction');

function onchangedirectioninside(parent) {
    var node, currentDirection, nodeDirection;

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

    onchangedirectioninside(parent.parent);
}

function oninsert() {
    onchangedirectioninside(this.parent);
}

function onremove(previousParent) {
    onchangedirectioninside(previousParent);
}

function onchangetext(value) {
    var data = this.data,
        oldDirection, newDirection;

    oldDirection = data.direction;
    newDirection = value ? direction(value) : 'neutral';

    data.direction = newDirection;

    if (newDirection !== oldDirection) {
        onchangedirectioninside(this.parent);
    }
}

function attach(retext) {
    var WordNode = retext.parser.TextOM.WordNode;

    WordNode.on('changetext', onchangetext);
    WordNode.on('insert', oninsert);
    WordNode.on('remove', onremove);
}

exports = module.exports = function () {};

exports.attach = attach;
