const createAppStateUpdater = require('./createAppStateUpdater');
const Bacon = require('baconjs');

module.exports = startDisplay;

const identity = function(_){ return _; };

// Starts the app rendering event cycle.
//
// renderFn is a user-defined function which takes an appState and an appUpdater function and returns a virtual-dom tree.
// initialState is the initial appState. 
// initialRealizer is the intial virtual-dom-to-real-dom realizer function, usually obtained by calling `realizer` or `realizerForContainer`.

function startDisplay( renderFn, initialState, initialRealizer ){

  const stateTransformationStream = new Bacon.Bus();
  const appStateUpdater = createAppStateUpdater(stateTransformationStream);

  function worldTransformer(prevWorld,transformer){
    const nextState = transformer(prevWorld.state);
    const tree = renderFn(nextState,appStateUpdater);
    const nextRealizer = prevWorld.realizer(tree);
    return {
      state: nextState, realizer: nextRealizer
    };
  }

  const initialWorld = {
    state: initialState,
    realizer: initialRealizer
  };

  stateTransformationStream
    .scan(initialWorld,worldTransformer)
    .onValue();

  stateTransformationStream.push(identity);
}
