module.exports = createPropMutator;

function createPropMutator(propertyName,mutator){
  return function(immutable){
    return immutable.update(propertyName,mutator);
  }
}
