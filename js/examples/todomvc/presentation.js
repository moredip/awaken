/** @jsx jsxToHyperscriptAdapter */

function jsxToHyperscriptAdapter(name,props,...children){
  return h(name,props,children);
}

const {h,_} = Awaken;
const classNames = require('classnames');
const iff = require('../../iff');

const ENTER_KEY = 13,
      ESC_KEY = 27;

function targetFromEvent(e){
  return e.target || e.srcElement;
}

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

  function onBlur(e){
    notifyFn('edit-todo-commit',todo.uid);
  }

  return <input 
          className="edit"
          onkeyup={onNewInputKeypress}
          onblur={onBlur}
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

  const todoIsBeingEditted = typeof todo.editingText !== 'undefined';
  const todoTextRenderer = todoIsBeingEditted ? renderTodoEditor : renderTodoLabel;

  return <li 
      key={todo.uid} 
      className={classNames({completed:todo.completed,editing:todoIsBeingEditted})}
    >
      <div className="view">
        <input className="toggle" type="checkbox" onchange={onCompletedChanged} checked={todo.completed}/>
        {iff(!todoIsBeingEditted,()=>renderTodoLabel(todo,notifyFn))}
        <button className="destroy" onclick={onDestroyClicked}></button>
      </div>
      {iff(todoIsBeingEditted,()=>renderTodoEditor(todo,notifyFn))}
    </li>;
}

function renderTodos(todos,notifyFn){
  return <ul className="todo-list">
    {todos.map( (todo) => renderTodo( todo, notifyFn ) )}
  </ul>;
}

function renderStats(todos,notifyFn){
  const uncompleteCount = _.countBy(todos, (t) => t.completed)[false] || 0;
  const noun = (uncompleteCount === 1) ? 'item' : 'items';

  return <span className="todo-count">{uncompleteCount} {noun} left</span>;
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
    <header className="header">
      <input 
        className="new-todo"
        onkeyup={onNewInputKeypress}
        placeholder="What needs to be done?"
        autofocus="true"
        value={appState.newTodoText}
        />
    </header>
    <section className="main">
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
        <button className="clear-completed" onclick={onClearCompleted}>Clear completed</button>
        )
      }
    </footer>
  </div>;
}

function render(appState,notifyFn){
  return <section className="todoapp">
    <h1>todos</h1>
    {renderBody(appState,notifyFn)}
  </section>;
}

module.exports = render;
