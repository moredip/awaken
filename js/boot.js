const Bacon = require('baconjs'),
      Immutable = require('immutable');
const createAppStateUpdater = require('./createAppStateUpdater'),
      realizerForContainer = require('./realizerForContainer');

module.exports = boot;

function identity(_){ return _; };

function createAndRunWorldStream(renderFn, initialWorld){
  const stateTransformationStream = new Bacon.Bus();
  const appStateUpdater = createAppStateUpdater(stateTransformationStream);

  function worldTransformer(prevWorld,transformer){
    const nextState = transformer(prevWorld.state);
    const nativeState = nextState.toJS();
    const tree = renderFn(nativeState,appStateUpdater);
    const nextRealizer = prevWorld.realizer(tree);
    return {
      state: nextState, realizer: nextRealizer
    };
  }

  stateTransformationStream
    .scan(initialWorld,worldTransformer)
    .onValue(); // this is needed to create a pull through the stream.

  // need an initial value pushed through the stream to trigger the first app render
  stateTransformationStream.push(identity);
}

// Start rendering the app and processing events.
//
// renderFn is a user-defined function which takes an appState and an appUpdater function and returns a virtual-dom tree.
//    - appState is a raw JS object (not an Immutable)
//    - appUpdater is a function which takes an Immutable collection and maps it into another Immutable
// initialState is the initial appState. 
// appContainer is a DOM element in which your rendered app will live.

function boot( renderFn, initialState, appContainer ){
  const initialRealizer = realizerForContainer( appContainer );

  const initialWorld = {
    state: Immutable.fromJS(initialState),
    realizer: initialRealizer
  };

  createAndRunWorldStream( renderFn, initialWorld );
}
