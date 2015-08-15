const {h,_,Immutable} = Awaken;

const ENTER_KEY = 13,
      ESC_KEY = 27;

function targetFromEvent(e){
  return e.target || e.srcElement;
}

function createTodo(todoText){
  return  Immutable.fromJS({
    text: todoText,
    completed: false
  });
}

const reactors = {
  'new-todo-update': function(immutable, text){
    return immutable.set('newTodoText',text);
  },
  'new-todo-enter': function(immutable){
    const newTodo = createTodo( immutable.get('newTodoText') );

    return immutable
      .set('newTodoText','')
      .update('todos',function(todos){
      return todos.push(newTodo);
    });
  },
  'todo-destroy': function(immutable, todoIx){
    return immutable.update('todos',function(todos){
      return todos.remove(todoIx);
    });
  },
  'todo-completion-toggled': function(immutable,todoIx,completionState){
    return immutable.update('todos',function(todos){
      return todos.update(todoIx, (todo) => todo.set('completed',completionState))
    });
  }
};

const lookupReactor = (notification) => reactors[notification]

function renderTodo(todo,todoIx,notifyFn){
  function onDestroyClicked(){
    console.log('asdfasdf')
    notifyFn('todo-destroy',todoIx);
  }

  function onCompletedChanged(e){
    notifyFn('todo-completion-toggled',todoIx,targetFromEvent(e).checked);
  }

  return h('li',[
      h('div.view',[
        h('input.completed',{type:'checkbox',onchange:onCompletedChanged,checked:todo.completed}),
        h('label',todo.text),
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
  const uncompleteCount = _.countBy(todos, (t) => t.completed)[false] || 0;
  const noun = (uncompleteCount === 1) ? 'item' : 'items';
  return h( 'p', `${uncompleteCount} ${noun} left` );
}

function renderBody(appState,notifyFn){
  function onNewInputKeypress(e){
    if( e.which === ENTER_KEY ){
      notifyFn('new-todo-enter');
    }else{
      notifyFn('new-todo-update',targetFromEvent(e).value);
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
          [
            renderTodos(appState.todos,notifyFn),
            renderStats(appState.todos)
          ]
          )
      ]);
}

function render(appState,notifyFn){
  return h(
      'section',
      [
        h('h1','TODOs'),
        renderBody(appState,notifyFn)
      ]
  );
}

const appContainer = document.getElementsByTagName('main')[0];
const initialState = { 'todos': [], 'newTodoText': '' };

Awaken.boot( render, initialState, appContainer, lookupReactor );
