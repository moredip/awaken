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
  },
  'todo-destroy': function(immutable, indexToRemove){
    return immutable.update('todos',function(todos){
      return todos.remove(indexToRemove);
    });
  }
};

function react(notification){
  const reactor = reactors[notification];
  return reactor;
}

function renderTodo(todo,todoIx,notifyFn){
  function onDestroyClicked(){
    notifyFn('todo-destroy',todoIx);
  }

  return h('li',[
      h('div.view',[
        h('label',todo),
        h(
          'button.destroy',
          {onclick:onDestroyClicked}, 
          'x'
          )
      ])]);
}

function renderTodos(todos,notifyFn){
  return h(
    'ul#todo-list', 
    todos.map( (todo,ix) => renderTodo( todo, ix, notifyFn ) )
  );
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
            h('input#new-todo', {onkeypress:onNewInputKeypress,placeholder:'What needs to be done?',autofocus:true})
          ]),
        h('section#main',
          renderTodos(todos,notifyFn)
          )
      ]);
}

function render(appState,notifyFn){
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
