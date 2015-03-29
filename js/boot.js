const Bacon = require('baconjs'),
      _ = require('underscore'),
      Immutable = require('immutable'),
      realizerForContainer = require('./realizerForContainer');

module.exports = boot;

function defaulter(fn,defaultValue){
  return function(x){
    // TODO: make this more robust?
    return (fn(x) || defaultValue);
  };
}

function createAndRunWorldStream(renderFn, reactorFn, initialWorld){
  const notificationStream = new Bacon.Bus(),
        notifyFn = function(x){ notificationStream.push(x); };

  function worldTransformer(prevWorld,transformer){
    const nextState = transformer(prevWorld.state),
          nativeState = nextState.toJS(),
          tree = renderFn(nativeState,notifyFn),
          nextRealizer = prevWorld.realizer(tree);

    console.log('state:',nativeState);

    return {
      state: nextState, 
      realizer: nextRealizer
    };
  }

  const reactorWithNoop = defaulter(reactorFn,_.identity);

  notificationStream
    .log('notification:')
    .map(reactorWithNoop)
    .scan(initialWorld,worldTransformer)
    .onValue(); // this is needed to create a pull through the stream.

  // need an initial value pushed through the stream to trigger the first app render
  notificationStream.push();
}

// Start rendering the app and processing events.
//
// renderFn is a user-defined function which takes an appState and an appUpdater function and returns a virtual-dom tree.
//    - appState is a raw JS object (not an Immutable)
//    - notifier is a function which can be used by event handlers to post notification messages. These messages will be later handled by the supplied reactorFn
// initialState is the initial appState. 
// appContainer is a DOM element in which your rendered app will live.
// reactorFn is a function which maps notification messages into functions which will mutate an Immutable app state into a new app state

function boot( renderFn, initialState, appContainer, reactorFn ){
  const initialRealizer = realizerForContainer( appContainer );

  const initialWorld = {
    state: Immutable.fromJS(initialState),
    realizer: initialRealizer
  };

  createAndRunWorldStream( renderFn, reactorFn, initialWorld );
}
