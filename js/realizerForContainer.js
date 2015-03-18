const realizer = require('./realizer');

module.exports = realizerForContainer; 

function realizerForContainer(appContainer){
  return realizer( appContainer );
}
