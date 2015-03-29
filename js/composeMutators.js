const _ = require('underscore');

module.exports = composeMutators;

function composeMutators( mutators ){
  if( _.isEmpty(mutators ) ){
    return _.identity;
  }

  // underscore's composition order seems backwards to me
  const reversedMutators = _.clone(mutators).reverse();
  return _.compose.apply(null,reversedMutators);
}
