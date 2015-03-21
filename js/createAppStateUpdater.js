module.exports = createAppStateUpdater;

function createAppStateUpdater(transformerStream){
  return function updater(stateTransformer){
    return function(){ 
      transformerStream.push(stateTransformer); 
    };
  };
};
