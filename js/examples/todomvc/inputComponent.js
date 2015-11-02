const {Immutable} = Awaken;

module.exports = { reactors, render };

function lookupInputComponentState(componentsRoot,componentName,componentUid){
  // TODO: need to handle missing state
  return componentsRoot.getIn([,'input',name,uid]);
}

const reactors = {
  'component/input-commit': function(immutable,notifyFn,componentKey){
    const componentState = lookupInputComponentState(immutable.get('__components'));
    const value = componentState.get('value');
    notifyFn('input/commit',componentKey,componentValue);
    return immutable;
  }
};

function render(appState,componentKey,notifyFn){
  const componentState = lookupInputComponentState(Immutable.fromJS(appState.__components),componentKey);
  const value = componentState.get('value');

  function onNewInputKeypress(e){
    if( e.which === ENTER_KEY ){
      notifyFn('component/input-commit',componentKey);
    }else if( e.which === ESC_KEY ){
      notifyFn('component/input-abort',componentKey);
    }else{
      notifyFn('component/input-update',componentKey);
    }
  }

  return <input 
        className="new-todo"
        onkeyup={onNewInputKeypress}
        placeholder="What needs to be done?"
        autofocus="true"
        value={value}
      />;
}

