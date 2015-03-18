module.exports = createAppStateUpdater;

function createAppStateUpdater(appState, onNewAppState){
  return function updater(stateTransformer){
    return function(){
      const newAppState = stateTransformer(appState);
      onNewAppState(newAppState);
    };
  };
};
