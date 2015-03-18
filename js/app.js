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
  // this is a bit weird. onNewAppState closes over nextRealizerFn, even though it won't be assigned a value until a few lines below. This is allowed in JS, but violates referential transparency. I can't see any other way to implement this behaviour though. the onNewAppState handler needs to have access to the output of calling realizerFn below. In order to call realizerFn we need a tree. To create the tree we need onNewAppState to be defined. Catch 22. :(
  const onNewAppState = function onNewAppState(newState){
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
