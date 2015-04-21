module.exports = {
  createPropMutator: require('./createPropMutator'),
  composeMutators: require('./composeMutators'),
  namespacedNotify: require('./namespacedNotify'),
  boot: require('./boot2'),

  h: require('virtual-dom/virtual-hyperscript'),
  _: require('underscore')
};
