module.exports = createSubstateUpdater;

function createSubstateUpdater(keyPathStr,rootUpdater){
  const keyPath = keyPathStr.split('.');

  return function(subtreeTransformer){
    function rootTransformer(immutable){
      return immutable.updateIn(keyPath,subtreeTransformer);
    };
    return rootUpdater(rootTransformer);
  };
}
