require('./helpers');

const createPropMutator = require('../js/createPropMutator'),
      Immutable = require('immutable');

describe( 'createPropMutator', function(){
  function prepender(x){
    return "mutated_" + x;
  }
  const anObj = Immutable.fromJS({foo: 'bar'});

  it('can mutate a simple property',function(){
    mutator = createPropMutator('foo', prepender);

    mutated = mutator(anObj);

    expect(anObj.toJS().foo).to.eq('bar');
    expect(mutated.toJS().foo).to.eq('mutated_bar');
  });

  it('creates a property which does not exist', function(){
    mutator = createPropMutator('missing', prepender);

    mutated = mutator(anObj);

    expect(mutated.toJS().missing).to.eq('mutated_undefined');
  });
});
