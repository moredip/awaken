const h = Awaken.h,
      _ = Awaken._,
      createPropMutator = Awaken.createPropMutator,
      namespacedNotify = Awaken.namespacedNotify;

const ENTER_KEY = 13,
      ESC_KEY = 27;

const reactors = {
  'new-todo-update': function(immutable, text){
    return immutable.set('newTodoText',text);
  },
  'new-todo-enter': function(immutable){
    const newTodoText = immutable.get('newTodoText');
    return immutable
      .set('newTodoText','')
      .update('todos',function(todos){
      return todos.push(newTodoText);
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

function renderStats(appState,notifyFn){
  function onNewInputKeypress(e){
    const target = e.target || e.srcElement;

    if( e.which === ENTER_KEY ){
      notifyFn('new-todo-enter');
    }else{
      notifyFn('new-todo-update',target.value);
    }
  };

  return h(
      'div',
      [
        h('header#header',
          [
            h(
              'input#new-todo', 
              {onkeyup:onNewInputKeypress,placeholder:'What needs to be done?',autofocus:true,value:appState.newTodoText}
            )
          ]),
        h('section#main',
          renderTodos(appState.todos,notifyFn)
          )
      ]);
}

function render(appState,notifyFn){
  return h(
      'section',
      [
        h('h1','TODOs'),
        renderStats(appState,notifyFn)
      ]
  );
}

const appContainer = document.getElementsByTagName('main')[0];
const initialState = { 'todos': [] };

Awaken.boot( render, initialState, appContainer, react );
