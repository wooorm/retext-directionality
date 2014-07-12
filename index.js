'use strict';

var direction = require('direction');

function onchangedirectioninside(parent) {
    if (!parent) {
        return;
    }

    var node = parent.head,
        currentDirection, nodeDirection;

    while (node) {
        nodeDirection = node.data.direction;

        if (nodeDirection) {
            if (!currentDirection) {
                currentDirection = nodeDirection;
            } else if (nodeDirection !== currentDirection &&
                nodeDirection !== 'neutral') {
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

    if (!value) {
        data.direction = null;
        return;
    }

    oldDirection = data.direction;

    data.direction = newDirection = direction(value);

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
