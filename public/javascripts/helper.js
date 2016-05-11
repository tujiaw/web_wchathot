
function log() {
  var log = '';
  for (var i=0; i<arguments.length; i++) {
    log += arguments[i];
  }
  $.ajax({
    type: 'POST',
    data: {text: '***' + log},
    url: '/log'
  }); 
}
