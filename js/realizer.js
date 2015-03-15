var createElement = require('virtual-dom/create-element'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch');

module.exports = createInitialRealizerFn;

function createNextRealizerFn(prevTree,prevRootNode){
  return function( newTree ){
    var patches = diff(prevTree,newTree);
    newRootNode = patch(prevRootNode,patches);

    return createNextRealizerFn(newTree,newRootNode);
  }
}

function initialRealization( tree, container ){
  var rootNode = createElement(tree);

  var container = document.getElementsByTagName('main')[0];
  container.appendChild(rootNode);

  return createNextRealizerFn(tree,rootNode);
};

// partial application of initialRealization
function createInitialRealizerFn(container){
  return function(tree){ return initialRealization(tree,container); };
}
