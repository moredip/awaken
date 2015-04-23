const h = Awaken.h,
      _ = Awaken._,
      createPropMutator = Awaken.createPropMutator,
      namespacedNotify = Awaken.namespacedNotify;

const ENTER_KEY = 13,
      ESC_KEY = 27;

const reactors = {
  'new-todo-enter': function(immutable, newTodo){
    return immutable.update('todos',function(todos){
      return todos.push(newTodo);
    });
  }
  //'a.up': createPropMutator('counter-a.count', incrOne ),
  //'a.down': createPropMutator('counter-a.count', decrOne ),
  //'b.up': createPropMutator('counter-b.count', incrOne ),
  //'b.down': createPropMutator('counter-b.count', decrOne )
};

function react(notification){
  const reactor = reactors[notification];
  return reactor;
}

function renderTodos(todos,notifyFn){
  return _.map( todos, function(todo){
    return h('div.todo',todo);
  });
}

function renderStats(todos,notifyFn){
  function onNewInputKeypress(e){
    if( e.which === ENTER_KEY ){
      const target = e.target || e.srcElement;
      notifyFn('new-todo-enter',target.value);
    }
  };

  const total = todos.length;
  return h(
      'div',
      [
        h('header#header',
          [
            //h('h1', 'todos'),
            h('input#new-todo', {onkeypress:onNewInputKeypress,placeholder:'What needs to be done?',autofocus:true})
          ]),
        h('section#main',
          renderTodos(todos,notifyFn)
          )
      ]);
}

function render(appState,notifyFn){
  //const counterA = renderCounter(appState['counter-a'],namespacedNotify('a',notifyFn));
  //const counterB = renderCounter(appState['counter-b'],namespacedNotify('b',notifyFn));

  return h(
      'section',
      [
        h('h1','TODOs'),
        renderStats(appState.todos,notifyFn)
      ]
  );
}

const appContainer = document.getElementsByTagName('main')[0];
const initialState = { 'todos': [] };

Awaken.boot( render, initialState, appContainer, react );
