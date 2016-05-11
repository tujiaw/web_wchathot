

function test1() {
  var log = Array.prototype.slice.call(arguments).join('');
  console.log(log);
}