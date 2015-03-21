const createAppStateUpdater = require('./createAppStateUpdater');

module.exports = startDisplay;

// Starts the app rendering event cycle.
//
// renderFn is a user-defined function which takes an appState and an appUpdater function and returns a virtual-dom tree.
// initialState is the initial appState. 
// initialRealizer is the intial virtual-dom-to-real-dom realizer function, usually obtained by calling `realizer` or `realizerForContainer`.

function startDisplay( renderFn, initialState, initialRealizer ){
  const stream = new Bacon.Bus();

  const display = function display(newState, e){
    const updater = createAppStateUpdater(newState, stream);
    const tree = renderFn(newState,updater);
    return {state: newState, realizer: e.realizer(tree)}
  };

  return stream.reduce({state: initialState, realizer: initialRealizer}, display);
}
