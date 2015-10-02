/** @jsx jsxToHyperscriptAdapter */

function jsxToHyperscriptAdapter(name,props,...children){
  return h(name,props,children);
}

const classNames = require('classnames');
const iff = require('../iff');
const {h,_,Immutable} = Awaken;

const ENTER_KEY = 13,
      ESC_KEY = 27;

function targetFromEvent(e){
  return e.target || e.srcElement;
}

function createTodo(todoText){
  return  Immutable.fromJS({
    text: todoText,
    completed: false,
    uid: _.uniqueId('todo:')
  });
}

const reactors = {
  'new-todo-update': function(immutable, text){
    return immutable.set('newTodoText',text);
  },
  'edit-todo-update': function(immutable, todoUid, text){
    return immutable.update('todos',function(todos){
      const todoIx = todos.findIndex( (todo) => todo.get('uid') === todoUid );

      return todos.update(todoIx, (todo) => todo.set('editingText',text));
    });
  },
  'new-todo-enter': function(immutable){
    const newTodo = createTodo( immutable.get('newTodoText') );

    return immutable
      .set('newTodoText','')
      .update('todos',function(todos){
      return todos.push(newTodo);
    });
  },
  'edit-todo-commit': function(immutable,todoUid){
    function todoUpdater(todo){
      return todo
        .set('text',todo.get('editingText'))
        .delete('editingText');
    }

    return immutable.update('todos',function(todos){
      const todoIx = todos.findIndex( (todo) => todo.get('uid') === todoUid );

      return todos.update(todoIx, todoUpdater);
    });
  },
  'edit-todo-abort': function(immutable,todoUid){
    return immutable.update('todos',function(todos){
      const todoIx = todos.findIndex( (todo) => todo.get('uid') === todoUid );

      return todos.update(todoIx, (todo) => todo.delete('editingText'));
    });
  },
  'todo-destroy': function(immutable, todoUid){
    return immutable.update('todos',function(todos){
      return todos.filterNot( (todo) => todo.get('uid') === todoUid );
    });
  },
  'todo-edit-requested': function(immutable,todoUid){
    function todoUpdater(todo){
      if(todo.get('uid') === todoUid){
        return todo.set('editingText',todo.get('text'));
      }else{
        return todo.delete('editingText');
      }
    };

    return immutable.update('todos',function(todos){
      return todos.map(todoUpdater);
    });
  },
  'todo-completion-toggled': function(immutable,todoUid,completionState){
    return immutable.update('todos',function(todos){
      const todoIx = todos.findIndex( (todo) => todo.get('uid') === todoUid );

      return todos.update(todoIx, (todo) => todo.set('completed',completionState))
    });
  },
  'completion-toggle-all': function(immutable){
    return immutable.update('todos', function(todos){
      const allTodosAreComplete = todos.every( (todo) => todo.get('completed') );
      const newCompleteness = !allTodosAreComplete;
      return todos.map((todo) => todo.set('completed',newCompleteness));
    });
  },
  'clear-completed-todos': function(immutable){
    return immutable.update('todos', function(todos){
      return todos.filterNot( (todo) => todo.get('completed') );
    });
  },
  'set-filter': function(immutable,filter){
    return immutable.set('filter',filter);
  }
};

const lookupReactor = (notification) => reactors[notification]

function renderTodoLabel(todo,notifyFn){
  function onLabelDoubleClicked(){
    notifyFn('todo-edit-requested',todo.uid);
  }
  return <label ondblclick={onLabelDoubleClicked}>{todo.text}</label>
}

function renderTodoEditor(todo,notifyFn){
  function onNewInputKeypress(e){
    if( e.which === ENTER_KEY ){
      notifyFn('edit-todo-commit',todo.uid);
    }else if( e.which === ESC_KEY ){
      notifyFn('edit-todo-abort',todo.uid);
    }else{
      notifyFn('edit-todo-update',todo.uid,targetFromEvent(e).value);
    }
  };

  return <input 
        onkeyup={onNewInputKeypress}
        value={todo.editingText}
        />;
}

function renderTodo(todo,notifyFn){
  function onDestroyClicked(){
    notifyFn('todo-destroy',todo.uid);
  }

  function onCompletedChanged(e){
    notifyFn('todo-completion-toggled',todo.uid,targetFromEvent(e).checked);
  }

  const todoTextRenderer = todo.editingText ? renderTodoEditor : renderTodoLabel;

  return <li key={todo.uid}>
    <div className="view">
      <input className="completed" type="checkbox" onchange={onCompletedChanged} checked={todo.completed}/>
      {todoTextRenderer(todo,notifyFn)}
      <button className="destroy" onclick={onDestroyClicked}>x</button>
    </div>
    </li>;
}

function renderTodos(todos,notifyFn){
  return <ul id="todo-list">
    {todos.map( (todo) => renderTodo( todo, notifyFn ) )}
  </ul>;
}

function renderStats(todos,notifyFn){
  const uncompleteCount = _.countBy(todos, (t) => t.completed)[false] || 0;
  const noun = (uncompleteCount === 1) ? 'item' : 'items';

  return <p>{uncompleteCount} {noun} left</p>;
}

function renderFilters(appState,notifyFn){
  const filters = ['All','Active','Completed'].map( function(filter){
    const lfilter = filter.toLowerCase();
    return <li><a 
      href="#" 
      onclick={()=>notifyFn('set-filter',lfilter)}
      className={classNames({selected: lfilter === appState.filter})}
      >
      {filter}
    </a></li>
  });


  return <ul className="filters">
    {filters}
  </ul>;
}

function filterTodos(todos,filter){
  function rejectCompleted(todos){
    return _.reject(todos, (todo) => todo.completed)
  }
  function selectCompleted(todos){
    return _.filter(todos, (todo) => todo.completed)
  }
  const todoFilters = {
    all: _.identity,
    active: rejectCompleted,
    completed: selectCompleted
  }

  return todoFilters[filter](todos);
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
  function onClearCompleted(e){
    notifyFn('clear-completed-todos');
  }

  const allTodos = appState.todos;
  const [completedTodos,activeTodos] = _.partition(allTodos,(todo)=>todo.completed);

  const thereAreSomeTodos = allTodos.length > 0;
  const everyTodoIsCompleted = activeTodos.length === 0;
  const someTodosAreCompleted = completedTodos.length > 0;

  const filteredTodos = filterTodos(allTodos,appState.filter);

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
      {iff(thereAreSomeTodos, () =>
          <input className="toggle-all" type="checkbox" onchange={onToggleAll} checked={everyTodoIsCompleted}></input>
          )
      }
      {renderTodos(filteredTodos,notifyFn)}
    </section>
    <footer className="footer">
      {renderStats(appState.todos,notifyFn)}
      {renderFilters(appState,notifyFn)}
      {iff(someTodosAreCompleted, ()=>
        <button id="clear-completed" onclick={onClearCompleted}>Clear completed</button>
        )
      }
    </footer>
  </div>;
}

function render(appState,notifyFn){
  return <section>
    <h1>TODOS</h1>
    {renderBody(appState,notifyFn)}
  </section>;
}

const appContainer = document.getElementsByTagName('main')[0];
const initialState = { 'todos': [], 'newTodoText': '', filter: 'all' };

Awaken.boot( render, initialState, appContainer, lookupReactor );
