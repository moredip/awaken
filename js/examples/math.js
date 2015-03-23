const h = Awaken.h,
    createPropMutator = Awaken.createPropMutator;

function incrOne(x){ return x+1; }
function decrOne(x){ return x-1; }
const upper = createPropMutator('count', incrOne )
const downer = createPropMutator('count', decrOne )

function renderCounter(counterState, appStateUpdater){
  const countUp = appStateUpdater( upper );
  const countDown = appStateUpdater( downer );

  const content = 'count: '+counterState.count;
  return h(
    'section.counter',
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

function render(appState,appStateUpdater){
  const updaterForA = Awaken.createSubstateUpdater('counter-a',appStateUpdater);
  const updaterForB = Awaken.createSubstateUpdater('counter-b',appStateUpdater);
  const counterA = renderCounter(appState['counter-a'],updaterForA);
  const counterB = renderCounter(appState['counter-b'],updaterForB);

  return h(
      'section',
      [counterA,counterB]
  );
}

const appContainer = document.getElementsByTagName('main')[0];
const initialState = { 'counter-a':{count:0},'counter-b':{count:10} };

Awaken.boot( render, initialState, appContainer);
