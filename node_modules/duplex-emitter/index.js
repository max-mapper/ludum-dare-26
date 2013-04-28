var objectDuplexStream = require('./object_duplex_stream');
var emitter = require('./emitter');

function duplexToEmitter(duplexStream) {
  return emitter(objectDuplexStream(duplexStream));
}

module.exports = duplexToEmitter;