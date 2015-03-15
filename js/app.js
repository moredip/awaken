var h = require('virtual-dom/virtual-hyperscript'),
    realizer = require('./realizer');

var appContainer = document.getElementsByTagName('main')[0];
var realizerFn = realizer( appContainer );

function render(count){
  var content = 'count: '+count;
  return h(
    'h1',
    { onclick: function(){ console.log('clicked!'); }},
    content
  );
}

var count = 0;
setInterval( function(){
  var tree = render(count);
  realizerFn = realizerFn(tree);
  count++;
}, 100);
