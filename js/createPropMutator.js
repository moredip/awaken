module.exports = createPropMutator;

function createPropMutator(propertyName,mutator){
  return function(obj){
    // TODO: a proper fully immutable impl.
    const mutatedObj = {}
    for (const prop in obj) {
      if( prop === propertyName ){
        mutatedObj[prop] = mutator(obj[prop]);
      }else{
        mutatedObj[prop] = obj[prop];
      }
    }
    return mutatedObj;
  }
}
