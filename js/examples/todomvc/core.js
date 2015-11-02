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

function removeEmptyTodos(todos){
  return todos.filterNot( (todo) => _.isEmpty(todo.get('text')) );
}

const reactors = {
  'new-todo-update': function(immutable, notifyFn, text){
    return immutable.set('newTodoText',text);
  },
  'edit-todo-update': function(immutable, notifyFn, todoUid, text){
    return updateTodo(immutable,todoUid, (todo) => todo.set('editingText',text))
  },
  'new-todo-enter': function(immutable, notifyFn){
    const trimmedText = immutable.get('newTodoText').trim();
    if( _.isEmpty(trimmedText) ){
      return immutable;
    }

    const newTodo = createTodo(trimmedText);
    return immutable
      .set('newTodoText','')
      .update('todos',function(todos){
      return todos.push(newTodo);
    });
  },
  'edit-todo-commit': function(immutable, notifyFn, todoUid){
    immutable = updateTodo(immutable,todoUid, function (todo){
      return todo
        .set('text',todo.get('editingText'))
        .delete('editingText');
    });

    return immutable.update('todos',removeEmptyTodos);
  },
  'edit-todo-abort': function(immutable, notifyFn, todoUid){
    return updateTodo(immutable,todoUid, (todo) => todo.delete('editingText'));
  },
  'todo-destroy': function(immutable, notifyFn, todoUid){
    return immutable.update('todos',function(todos){
      return todos.filterNot( (todo) => todo.get('uid') === todoUid );
    });
  },
  'todo-edit-requested': function(immutable, notifyFn, todoUid){
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
  'todo-completion-toggled': function(immutable, notifyFn, todoUid, completionState){
    return updateTodo(immutable,todoUid, (todo) => todo.set('completed',completionState));
  },
  'completion-toggle-all': function(immutable, notifyFn){
    return immutable.update('todos', function(todos){
      const allTodosAreComplete = todos.every( (todo) => todo.get('completed') );
      const newCompleteness = !allTodosAreComplete;
      return todos.map((todo) => todo.set('completed',newCompleteness));
    });
  },
  'clear-completed-todos': function(immutable, notifyFn){
    return immutable.update('todos', function(todos){
      return todos.filterNot( (todo) => todo.get('completed') );
    });
  },
  'set-filter': function(immutable, notifyFn, filter){
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
