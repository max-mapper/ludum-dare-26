var Stream = require('stream');

function write(d) {
  this.emit('write', d);
}

function end() {
  this.emit('end');
}

function setEncoding(encoding) {
  this._encoding = encoding;
}

module.exports = function() {
  var s = new Stream();
  s.writable = true;
  s.readable = true;
  s.write = write;
  s.end = end;
  s.setEncoding = setEncoding;
  
  return s;
}