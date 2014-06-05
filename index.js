/* jshint -W084, -W093 */
(function () {
    var visit = require('retext-visit');

    exports = module.exports = function () {};

    exports.attach = attach;

    exports.direction = directionality;

    var GROUP_LEFT_TO_RIGHT, GROUP_RIGHT_TO_LEFT,
        EXPRESSION_LEFT_TO_RIGHT, EXPRESSION_RIGHT_TO_LEFT;

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

    function oninsert() {
        onchangedirectioninside(this.parent);
    }

    function onremove(previousParent) {
        onchangedirectioninside(previousParent);
    }

    function onchangetext(value) {
        var data = this.data,
            oldDirection, direction;

        if (!value) {
            data.direction = null;
            return;
        }

        oldDirection = data.direction;

        data.direction = direction = directionality(value);

        if (direction !== oldDirection) {
            onchangedirectioninside(this.parent);
        }
    }

    function onchangedirectioninside(parent) {
        if (!parent) {
            return;
        }

        var node = parent.head,
            direction, nodeDirection;

        while (node) {
            if (nodeDirection = node.data.direction) {
                if (!direction) {
                    direction = nodeDirection;
                } else if (nodeDirection !== direction &&
                    nodeDirection !== 'neutral') {
                        direction = 'neutral';
                        break;
                }
            }

            node = node.next;
        }

        parent.data.direction = direction || 'neutral';

        onchangedirectioninside(parent.parent);
    }

    function directionality(value) {
        return EXPRESSION_RIGHT_TO_LEFT.test(value) ?
            'rtl' : EXPRESSION_LEFT_TO_RIGHT.test(value) ?
            'ltr' : 'neutral';
    }

    function attach(retext) {
        var WordNode = retext.parser.TextOM.WordNode;

        retext.use(visit);

        WordNode.on('changetext', onchangetext);
        WordNode.on('insert', oninsert);
        WordNode.on('remove', onremove);
    }
})();
