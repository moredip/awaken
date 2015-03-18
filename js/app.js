const h = require('virtual-dom/virtual-hyperscript'),
    realizerForContainer = require('./realizerForContainer'),
    startDisplay = require('./startDisplay'),
    createPropMutator = require('./createPropMutator');

function incrOne(x){ return x+1; }
function decrOne(x){ return x-1; }

function render(appState, appStateUpdater){
  const onClickUp = appStateUpdater( createPropMutator('count', incrOne ) );
  const onClickDown = appStateUpdater( createPropMutator('count', decrOne ) );

  const content = 'count: '+appState.count;
  return h(
    'section',
    [
    h(
      'p',
      content
    ),
    h(
      'button',
      { onclick: onClickUp },
      'UP'
    ),
    h(
      'button',
      { onclick: onClickDown },
      'DOWN'
    )
    ]
  );
}

const initialRealizer = realizerForContainer( document.getElementsByTagName('main')[0] ),
      initialState = { count:0 };

startDisplay( render, initialState, initialRealizer );
