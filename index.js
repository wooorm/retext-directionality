var directionality = require('retext-directionality');
var visit = require('retext-visit');
var dom = require('retext-dom');
var Retext = require('retext');
var retext = new Retext().use(visit).use(directionality).use(dom);

var inputElement = document.getElementsByTagName('textarea')[0];
var formElement = document.getElementsByTagName('form')[0];
var outputElement = document.getElementsByTagName('div')[0];
var currentDOMTree, currentTree;

function makeSmarter(value) {
    if (currentDOMTree) {
        currentDOMTree.parentNode.removeChild(currentDOMTree);
    }

    currentTree = retext.parse(value);

    currentTree.visit(function (node) {
        if (!node.DOMTagName || !node.data.direction) {
            return
        }

        if (node.data.direction !== 'neutral') {
            node.toDOMNode().setAttribute('dir', node.data.direction);
        } else {
            node.toDOMNode().setAttribute('data-dir', node.data.direction);
        }
    });

    currentDOMTree = currentTree.toDOMNode();
    outputElement.appendChild(currentDOMTree);
}

inputElement.addEventListener('input', function (event) {
    makeSmarter(inputElement.value);
});

makeSmarter(inputElement.value);
