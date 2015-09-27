/** @jsx jsxToHyperscriptAdapter */

function jsxToHyperscriptAdapter(name,props,...children){
  return h(name,props,children);
}

const {h,_,Immutable} = Awaken;
const iff = require('../iff');

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
  },
  'completion-toggle-all': function(immutable){
    return immutable.update('todos', function(todos){
      const allTodosAreComplete = todos.every( (todo) => todo.get('completed') );
      const newCompleteness = !allTodosAreComplete;
      return todos.map((todo) => todo.set('completed',newCompleteness));
    });
  }
};

const lookupReactor = (notification) => reactors[notification]

function renderTodo(todo,todoIx,notifyFn){
  function onDestroyClicked(){
    notifyFn('todo-destroy',todoIx);
  }

  function onCompletedChanged(e){
    notifyFn('todo-completion-toggled',todoIx,targetFromEvent(e).checked);
  }

  return <li>
    <div className="view">
      <input className="completed" type="checkbox" onchange={onCompletedChanged} checked={todo.completed}/>
      <label>{todo.text}</label>
      <button className="destroy" onclick={onDestroyClicked}>x</button>
    </div>
    </li>;
}

function renderTodos(todos,notifyFn){
  return <ul id="todo-list">
    {todos.map( (todo,ix) => renderTodo( todo, ix, notifyFn ) )}
  </ul>;
}

function renderStats(todos,notifyFn){
  const uncompleteCount = _.countBy(todos, (t) => t.completed)[false] || 0;
  const noun = (uncompleteCount === 1) ? 'item' : 'items';

  return <p>{uncompleteCount} {noun} left</p>;
}

function renderBody(appState,notifyFn){
  function onNewInputKeypress(e){
    if( e.which === ENTER_KEY ){
      notifyFn('new-todo-enter');
    }else{
      notifyFn('new-todo-update',targetFromEvent(e).value);
    }
  };

  function onToggleAll(e){
    notifyFn('completion-toggle-all');
  }

  const someTodos = appState.todos.length > 0;

  const everyTodoCompleted = appState.todos.every( (todo) => todo.completed );



  return <div>
    <header id="header">
      <input 
        id="new-todo"
        onkeyup={onNewInputKeypress}
        placeholder="What needs to be done?"
        autofocus="true"
        value={appState.newTodoText}
        />
    </header>
    <section id="main">
      {iff(someTodos, () =>
          <input className="toggle-all" type="checkbox" onchange={onToggleAll} checked={everyTodoCompleted}></input>
          )
      }
      {renderTodos(appState.todos,notifyFn)}
      {renderStats(appState.todos)}
    </section>
  </div>;
}

function render(appState,notifyFn){
  return <section>
    <h1>TODOS</h1>
    {renderBody(appState,notifyFn)}
  </section>;
}

const appContainer = document.getElementsByTagName('main')[0];
const initialState = { 'todos': [], 'newTodoText': '' };

Awaken.boot( render, initialState, appContainer, lookupReactor );
