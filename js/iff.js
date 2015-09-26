module.exports = function iff(predicate,fn){
  if(predicate){
    return fn();
  }else{
    return undefined;
  }
}
