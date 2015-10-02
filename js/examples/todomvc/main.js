const {initialAppState,lookupReactor} = require('./core');
const render = require('./presentation');

const appContainer = document.getElementsByTagName('main')[0];

Awaken.boot( render, initialAppState, appContainer, lookupReactor );
