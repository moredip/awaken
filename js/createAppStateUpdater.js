module.exports = createAppStateUpdater;

function createAppStateUpdater(appState, stream){
  return function updater(stateTransformer){
    return function(){
      const newAppState = stateTransformer(appState);
      stream.push(newAppState);
    };
  };
};
