const h = require('virtual-dom/virtual-hyperscript'),
      Bacon = require('baconjs');

const createTreeStreamForContainer = require('../treeStream');

const appContainer = document.getElementsByTagName('main')[0];
const treeStream = createTreeStreamForContainer(appContainer);



const appStateStream = Bacon.repeatedly(500,"abcdefg".split(''))
  .map( function(x){
    return h('h1', 'letter '+x);
  });

treeStream.plug(appStateStream);
