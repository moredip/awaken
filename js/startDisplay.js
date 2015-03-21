const createAppStateUpdater = require('./createAppStateUpdater');

module.exports = startDisplay;

// Starts the app rendering event cycle.
//
// renderFn is a user-defined function which takes an appState and an appUpdater function and returns a virtual-dom tree.
// initialState is the initial appState. 
// initialRealizer is the intial virtual-dom-to-real-dom realizer function, usually obtained by calling `realizer` or `realizerForContainer`.

function startDisplay( renderFn, initialState, initialRealizer ){
  const display = function display(appState,realizerFn){
    // This is a bit weird. onNewAppState closes over nextRealizerFn, even though it won't be assigned a value until a few lines below. This is allowed in JS, but violates referential transparency. I can't see any other way to implement this behaviour though. the onNewAppState handler needs to have access to the output of calling realizerFn below. In order to call realizerFn we need a tree. To create the tree we need onNewAppState to be defined. Catch 22. :(
    const onNewAppState = function onNewAppState(newState){
      display(newState,nextRealizerFn);                         // nextRealizerFn *referenced* here
    }
    const appStateUpdater = createAppStateUpdater(appState,onNewAppState);
    const tree = renderFn(appState,appStateUpdater);
    const nextRealizerFn = realizerFn(tree);                    // nextRealizerFn *assigned* here
  };
 
  display(initialState,initialRealizer);
}
