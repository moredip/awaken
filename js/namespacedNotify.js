module.exports = namespacedNotify;

function namespacedNotify(namespace,notifyFn){
  return function(msg){
    const namespacedMsg = [namespace,msg].join('.');
    notifyFn(namespacedMsg);
  };
}
