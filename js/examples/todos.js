const h = Awaken.h,
      _ = Awaken._,
      createPropMutator = Awaken.createPropMutator,
      namespacedNotify = Awaken.namespacedNotify;


function react(notification){
  return undefined;
  //const reactor = reactors[notification];

  //return Awaken.composeMutators([
    //fnOrIdentity(reactor),
    //sumCounters
  //]);
}

function renderStats(todos){
  const total = todos.length;
  return h(
      'div',
      [ h('p', 'total: '+total) ]
      );
}

function render(appState,notifyFn){
  //const counterA = renderCounter(appState['counter-a'],namespacedNotify('a',notifyFn));
  //const counterB = renderCounter(appState['counter-b'],namespacedNotify('b',notifyFn));

  return h(
      'section',
      [
        h('h1','TODOs'),
        renderStats(appState.todos)
      ]
  );
}

const appContainer = document.getElementsByTagName('main')[0];
const initialState = { 'todos': [] };

Awaken.boot( render, initialState, appContainer, react );
