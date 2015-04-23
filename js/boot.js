const Bacon = require('baconjs'),
      _ = require('underscore'),
      Immutable = require('immutable'),
      createTreeRealizerStreamForContainer = require('./treeRealizerStream');

module.exports = boot;

// Start rendering the app and processing events.
//
// renderFn is a user-defined function which takes an appState and an appUpdater function and returns a virtual-dom tree.
//    - appState is a raw JS object (not an Immutable)
//    - notifier is a function which can be used by event handlers to post notification messages. These messages will be later handled by the supplied reactorFn
// initialState is the initial appState. 
// appContainer is a DOM element in which your rendered app will live.
// reactorFn is a function which maps notification messages into functions which will mutate an Immutable app state into a new app state
function boot( renderFn, initialState, appContainer, reactorFn ){

  const notificationStream = new Bacon.Bus();
  function publishNotification(notificationName /*, notificationArgs*/){
    const notificationArgs = Array.prototype.slice.call(arguments, 1);
    notificationStream.push({
      name: notificationName,
      args: notificationArgs
    });
  }

  function appStateTransformer(previousState,notification){
    const transformFn = reactorFn(notification.name);
    if( transformFn ){
      return transformFn.apply(null,[previousState].concat(notification.args));
    }else{
      return previousState;
    }
  }

  function appStateToTree(appState){
    console.log( 'app state:', appState.toJS() );
    return renderFn(appState.toJS(),publishNotification);
  };

  const treeStream = notificationStream
      .log('notification:')
      .scan( Immutable.fromJS(initialState), appStateTransformer )
      .map( appStateToTree );

  createTreeRealizerStreamForContainer(appContainer).plug( treeStream );

  publishNotification('startup');
}
