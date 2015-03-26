module.exports = createPropMutator;

function createPropMutator(keyPathStr,mutator){
  const keyPath = keyPathStr.split('.');

  return function(immutable){
    return immutable.updateIn(keyPath,mutator);
  };
}
