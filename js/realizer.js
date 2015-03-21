const createElement = require('virtual-dom/create-element'),
    diff = require('virtual-dom/diff'),
    patch = require('virtual-dom/patch');

module.exports = createInitialRealizerFn;

// A realizer is a function which takes a new virtual-dom tree and makes it "real" by 
// mutating the actual DOM. Each call to the realizer returns a new realizer which can be used to
// apply the next mutation.

function createNextRealizerFn(prevTree,prevRootNode){
  return function( newTree ){
    const patches = diff(prevTree,newTree);
    const newRootNode = patch(prevRootNode,patches);

    return createNextRealizerFn(newTree,newRootNode);
  }
}

function initialRealization( tree, container ){
  const rootNode = createElement(tree);
  container.appendChild(rootNode);
  return createNextRealizerFn(tree,rootNode);
};

// partial application of initialRealization
function createInitialRealizerFn(container){
  return function(tree){ return initialRealization(tree,container); };
}
