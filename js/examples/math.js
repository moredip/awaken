const h = Awaken.h,
    createPropMutator = Awaken.createPropMutator,
    namespacedNotify = Awaken.namespacedNotify;

function incrOne(x){ return x+1; }
function decrOne(x){ return x-1; }

function renderCounter(counterState, notifyFn){

  function onClickUp(){
    notifyFn('up');
  };

  function onClickDown(){
    notifyFn('down');
  };

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

const reactors = {
  'a.up': createPropMutator('counter-a.count', incrOne ),
  'a.down': createPropMutator('counter-a.count', decrOne ),
  'b.up': createPropMutator('counter-b.count', incrOne ),
  'b.down': createPropMutator('counter-b.count', decrOne )
};

function react(notification){
  return reactors[notification];
}

function render(appState,notifyFn){
  const counterA = renderCounter(appState['counter-a'],namespacedNotify('a',notifyFn));
  const counterB = renderCounter(appState['counter-b'],namespacedNotify('b',notifyFn));

  return h(
      'section',
      [counterA,counterB]
  );
}

const appContainer = document.getElementsByTagName('main')[0];
const initialState = { 'counter-a':{count:0},'counter-b':{count:10} };

Awaken.boot( render, initialState, appContainer, react );
