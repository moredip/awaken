const createAppStateUpdater = require('./createAppStateUpdater');
const Bacon = require('baconjs');

module.exports = startDisplay;

// Starts the app rendering event cycle.
//
// renderFn is a user-defined function which takes an appState and an appUpdater function and returns a virtual-dom tree.
// initialState is the initial appState. 
// initialRealizer is the intial virtual-dom-to-real-dom realizer function, usually obtained by calling `realizer` or `realizerForContainer`.

function startDisplay( renderFn, initialState, initialRealizer ){
  const stream = new Bacon.Bus();

  const display = function display(realizer, newState){
    const updater = createAppStateUpdater(newState, stream);
    const tree = renderFn(newState,updater);
    return realizer(tree)
  };

  stream.reduce(initialRealizer, display).onValue(function(e){
    console.log("E", e);
  });

  stream.push(initialState);
}
