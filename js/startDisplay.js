const createAppStateUpdater = require('./createAppStateUpdater');

module.exports = startDisplay;

// Starts the app rendering event cycle.
//
// renderFn is a user-defined function which takes an appState and an appUpdater function and returns a virtual-dom tree.
// initialState is the initial appState. 
// initialRealizer is the intial virtual-dom-to-real-dom realizer function, usually obtained by calling `realizer` or `realizerForContainer`.

function startDisplay( renderFn, initialState, initialRealizer ){
  const stream = new Bacon.Bus();

  const display = function display(e){
    var updater = createAppStateUpdater(e, stream);
    const tree = renderFn(e.appState,updater);
    return {state: tree, realizer: e.realizerFn(tree)}
  };

  return stream.reduce({state: initialState, realizer: initialRealizer}, display);
}
