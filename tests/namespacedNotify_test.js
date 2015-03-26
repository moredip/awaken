require('./helpers');

const namespacedNotify = require('../js/namespacedNotify');

describe('namespacedNotify',function(){
  it('prepends a namespace to the first arg', function(){
    const notifyFn = sinon.spy();
    namespacedNotifyFn = namespacedNotify('a-namespace',notifyFn);
    namespacedNotifyFn('foo');

    expect(notifyFn).to.have.been.calledWith('a-namespace.foo');
  });
});
