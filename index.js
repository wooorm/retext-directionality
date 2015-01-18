/**
 * Dependencies.
 */

var Retext = require('wooorm/retext@0.5.0');
var directionality = require('wooorm/retext-directionality@0.1.8');
var dom = require('wooorm/retext-dom@0.3.1');
var visit = require('wooorm/retext-visit@0.2.5');

/**
 * Retext.
 */

var retext = new Retext()
    .use(dom)
    .use(visit)
    .use(directionality);

/**
 * DOM elements.
 */

var $input = document.getElementsByTagName('textarea')[0];
var $output = document.getElementsByTagName('div')[0];

/**
 * Events
 */

var tree;

function oninputchange() {
    if (tree) {
        tree.toDOMNode().parentNode.removeChild(tree.toDOMNode());
    }

    retext.parse($input.value, function (err, root) {
        if (err) throw err;

        tree = root;

        tree.visit(function (node) {
            if (!node.DOMTagName || !node.data.direction) {
                return
            }

            if (node.data.direction !== 'neutral') {
                node.toDOMNode().setAttribute('dir', node.data.direction);
            } else {
                node.toDOMNode().setAttribute('data-dir', node.data.direction);
            }
        });

        $output.appendChild(tree.toDOMNode());
    });
}

$input.addEventListener('input', oninputchange);

oninputchange();
