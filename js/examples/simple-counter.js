const h = Awaken.h,
    createPropMutator = Awaken.createPropMutator;

function incrOne(x){ return x+1; }
function decrOne(x){ return x-1; }
const upper = createPropMutator('count', incrOne )
const downer = createPropMutator('count', decrOne )

function render(appState, appStateUpdater){
  const countUp = appStateUpdater( upper );
  const countDown = appStateUpdater( downer );

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
      { onclick: countUp },
      'UP'
    ),
    h(
      'button',
      { onclick: countDown },
      'DOWN'
    )
    ]
  );
}

const appContainer = document.getElementsByTagName('main')[0];
const initialState = { count:0 };

Awaken.boot( render, initialState, appContainer);
