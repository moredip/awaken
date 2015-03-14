var h = require('virtual-dom/virtual-hyperscript'),
    createElement = require('virtual-dom/create-element'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch');

var tree = h('h1','oh hai');
var rootNode = createElement(tree);

var container = document.getElementsByTagName('main')[0];
container.appendChild(rootNode);

setTimeout( function(){
  var newTree = h('h1','bing bong');
  var patches = diff(tree,newTree);
  rootNode = patch(rootNode, diff(tree,newTree));
  tree = newTree;
}, 1000);
