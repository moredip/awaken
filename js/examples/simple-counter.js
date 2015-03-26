const h = Awaken.h,
    createPropMutator = Awaken.createPropMutator;

function incrOne(x){ return x+1; }
function decrOne(x){ return x-1; }
const upper = createPropMutator('count', incrOne )
const downer = createPropMutator('count', decrOne )

function render(appState, notifyFn){

  function onClickUp(){
    notifyFn('up');
  };

  function onClickDown(){
    notifyFn('down');
  };

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

const reactors = {
  up: upper,
  down: downer
};

function react(notification){
  return reactors[notification];
}

const appContainer = document.getElementsByTagName('main')[0];
const initialState = { count:0 };

Awaken.boot( render, initialState, appContainer, react );
