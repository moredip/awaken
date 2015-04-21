const Bacon = require('baconjs'),
      _ = require('underscore'),
      Immutable = require('immutable'),
      createTreeStreamForContainer = require('./treeStream');

module.exports = boot;

function appStateTransformer(previousState,transformFn){
  if( transformFn ){
    return transformFn(previousState);
  }else{
    return previousState;
  }
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

  const notificationStream = new Bacon.Bus(),
        publishNotification = _.bind(notificationStream.push, notificationStream);

  function appStateToTree(appState){
    return renderFn(appState.toJS(),publishNotification);
  };

  const treeStream = notificationStream
      .log('notification:')
      .map(reactorFn)
      .scan( Immutable.fromJS(initialState), appStateTransformer )
      .map( appStateToTree );

  createTreeStreamForContainer(appContainer).plug( treeStream );

  notificationStream.push('startup');
}
