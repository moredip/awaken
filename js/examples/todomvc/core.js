const {_,Immutable} = Awaken;

const initialAppState = { 
  todos: [], 
  newTodoText: '', 
  filter: 'all' 
};

function createTodo(todoText){
  return Immutable.Map({
    text: todoText,
    completed: false,
    uid: _.uniqueId('todo:')
  });
}

function updateTodo(immutableRoot,todoUid,todoUpdater){
  return immutableRoot.update('todos',function(todos){
    const todoIx = todos.findIndex( (todo) => todo.get('uid') === todoUid );

    return todos.update(todoIx,todoUpdater);
  });
}

const reactors = {
  'new-todo-update': function(immutable, text){
    return immutable.set('newTodoText',text);
  },
  'edit-todo-update': function(immutable, todoUid, text){
    return updateTodo(immutable,todoUid, (todo) => todo.set('editingText',text))
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
    return updateTodo(immutable,todoUid, function (todo){
      return todo
        .set('text',todo.get('editingText'))
        .delete('editingText');
    });
  },
  'edit-todo-abort': function(immutable,todoUid){
    return updateTodo(immutable,todoUid, (todo) => todo.delete('editingText'));
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
    return updateTodo(immutable,todoUid, (todo) => todo.set('completed',completionState));
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

function lookupReactor(notification){
  return reactors[notification];
}

module.exports = {
  lookupReactor,
  initialAppState
};
