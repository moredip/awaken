const h = Awaken.h,
    createPropMutator = Awaken.createPropMutator;

const Bacon = require('baconjs'),
      Immutable = require('immutable');

const createTreeStreamForContainer = require('../treeStream');

const appContainer = document.getElementsByTagName('main')[0];
const treeRealizationStream = createTreeStreamForContainer(appContainer);

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

function incrOne(x){ return x+1; }
function decrOne(x){ return x-1; }
const upper = createPropMutator('count', incrOne )
const downer = createPropMutator('count', decrOne )

const reactors = {
  up: upper,
  down: downer
};

function react(notification){
  return reactors[notification];
}

const notificationStream = new Bacon.Bus(),
      n = function(x){ notificationStream.push(x); };

const initialState = { count:0 };

const reactionStream = notificationStream
  .log('notification:')
  .map(react);


function appStateTransformer(previousState,transformFn){
  if( transformFn ){
    return transformFn(previousState);
  }else{
    return previousState;
  }
}

const transformedAppStates = reactionStream
    .scan( Immutable.fromJS(initialState), appStateTransformer )

const treeStream = transformedAppStates
  .map( function(appState){
    return render(appState.toJS(),n);
  });


treeRealizationStream.plug( treeStream );

notificationStream.push('startup');

