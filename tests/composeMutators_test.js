require('./helpers');

const composeMutators = require('../js/composeMutators'),
      createPropMutator = require('../js/createPropMutator'),
      Immutable = require('immutable');

describe('composeMutators', function(){
  it('does nothing for zero mutators', function(){
    const immutable = Immutable.fromJS({foo:'bar'});
    const mutator = composeMutators([]);

    const mutated = mutator(immutable);

    expect( mutated ).to.eq( immutable );
  });

  function fooPrepender(prefix){
    return createPropMutator('foo',function(x){
      return prefix + x;
    });
  }

  it('does a single mutation', function(){
    const immutable = Immutable.fromJS({foo:'bar'});
    const mutator = composeMutators([fooPrepender('++')]);

    const mutated = mutator(immutable);

    expect( mutated ).not.to.eq( immutable );
    expect( mutated.get('foo') ).to.eq( '++bar' );
  });

  it('does multiple mutations in the expected order', function(){
    const immutable = Immutable.fromJS({foo:'bar'});
    const mutator = composeMutators([
      fooPrepender('++'),
      fooPrepender('--'),
      fooPrepender('~~')
      ]);

    const mutated = mutator(immutable);

    expect( mutated.get('foo') ).to.eq( '~~--++bar' );
  });

});
