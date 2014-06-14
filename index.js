'use strict';

var direction, GROUP_LEFT_TO_RIGHT, GROUP_RIGHT_TO_LEFT,
    EXPRESSION_LEFT_TO_RIGHT, EXPRESSION_RIGHT_TO_LEFT;

direction = require('direction');

GROUP_LEFT_TO_RIGHT = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6' +
    '\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u200E\u2C00-\uFB1C' +
    '\uFE00-\uFE6F\uFEFD-\uFFFF';

GROUP_RIGHT_TO_LEFT = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC';

EXPRESSION_LEFT_TO_RIGHT = new RegExp(
    '^[^' + GROUP_RIGHT_TO_LEFT + ']*[' + GROUP_LEFT_TO_RIGHT + ']'
);

EXPRESSION_RIGHT_TO_LEFT = new RegExp(
    '^[^' + GROUP_LEFT_TO_RIGHT + ']*[' + GROUP_RIGHT_TO_LEFT + ']'
);

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
