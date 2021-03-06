const Bacon = require('baconjs');
const createInitialRealizerFn = require('./realizer');

module.exports = createTreeRealizerStreamForContainer; 

function applyRealizerToTree(prevRealizerFn, nextTree){
  return prevRealizerFn(nextTree);
}

function createTreeRealizerStreamForContainer(container){
  const treeStream = new Bacon.Bus();
  const initialRealizer = createInitialRealizerFn( container );

  treeStream
    //.log('realizing tree:')
    .scan(initialRealizer,applyRealizerToTree)
    .onValue(); // this is needed to create a pull through the stream.

  return treeStream;
}
