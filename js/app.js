const h = require('virtual-dom/virtual-hyperscript'),
    realizer = require('./realizer');

function initialRealizerFn(){
  const appContainer = document.getElementsByTagName('main')[0];
  return realizer( appContainer );
}

function initialState(){
  return {count:0};
}

function display(state,realizerFn){
  const onNewAppState = function(newState){
    display(newState,nextRealizerFn);
  }

  const tree = render(state,onNewAppState);
  const nextRealizerFn = realizerFn(tree);
}

function createUpdater(appState, onNewAppState){
  return function updater(stateTransformer){
    return function(){
      const newAppState = stateTransformer(appState);
      onNewAppState(newAppState);
    };
  };
}

function render(appState, onNewAppState){
  const updater = createUpdater(appState,onNewAppState);

  const onClickUp = updater( function(appState){
    return { count: appState.count + 1 };
  });
  const onClickDown = updater( function(appState){
    return { count: appState.count - 1 };
  });

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

display(initialState(),initialRealizerFn());
