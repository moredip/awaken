const createAppStateUpdater = require('./createAppStateUpdater');

module.exports = startDisplay;

// Starts the app rendering event cycle.
//
// renderFn is a user-defined function which takes an appState and an appUpdater function and returns a virtual-dom tree.
// initialState is the initial appState. 
// initialRealizer is the intial virtual-dom-to-real-dom realizer function, usually obtained by calling `realizer` or `realizerForContainer`.

function startDisplay( renderFn, initialState, initialRealizer ){
  const displayStream = new Bacon.Bus();

  const display = function display(e){
    const appState = e.state;
    const realizerFn = e.realizer;

    const onNewAppState = function onNewAppState(newState){
      displayStream.push({state: newState, realizer: realizer});
    }
    const appStateUpdaterStream = createAppStateUpdater(appState);
    appStateUpdaterStream.onValue(function(as){ renderFn(as) })
    const tree = renderFn(appState,appStateUpdaterStream.push);

    const nextRealizerFn = realizerFn(tree);
    return {state: appState, realizer: nextRealizerFn}
  };

  displayStream.reduce(display, {state: initialState, realizer:intitialRealizer}).onValue(console.log) // onValue should technically be pushed to the app calling code to be "pure"
}
