// peerjs
var PeerServer = require('peer').PeerServer
var server = new PeerServer({ port: 9000 })

// game lobby
var WebSocketServer = require('ws').Server
var websocket = require('websocket-stream')
var duplexEmitter = require('duplex-emitter')

var looking = {}

setInterval(function() {
  var connected = Object.keys(looking)
  if (connected.length === 1) looking[connected[0]].emit('nobody')
}, 3000)

var wss = new WebSocketServer({port: 8080})
wss.on('connection', function(ws) {
  var stream = websocket(ws)
  var emitter = duplexEmitter(stream)
  var peerID
  stream.once('end', leave)
  stream.once('error', leave)
  emitter.on('connected', leave)
  function leave() {
    if (peerID) delete looking[peerID]
  }
  emitter.on('looking', function(id) {
    peerID = id
    var others = Object.keys(looking)
    if (others.length === 0) {
      looking[id] = emitter
    } else {
      emitter.emit('peer', others[0])
      delete looking[others[0]]
    }
  })
})

