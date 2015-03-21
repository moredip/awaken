module.exports = createAppStateUpdater;

function createAppStateUpdater(e, stream){
  return function updater(stateTransformer){
    return function(){
      const newAppState = stateTransformer(e.appState);
      stream.push({state: e.newAppState, realizer: e.realizer});
    };
  };
};
