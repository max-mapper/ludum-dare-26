var id = ~~(Math.random() * 10000) + '' + ~~(Math.random() * 10000)
var peer = new Peer(id, {host: 'localhost', port: 9000})
window.peer = peer
console.log(id)

peer.on('connection', function(conn) {
  console.log('connection', conn)
  conn.on('data', function(data) {
    console.log(data)
  })
})


var createGame = require('voxel-hello-world')
var textures = require('disco-textures')(__dirname)
createGame({
  texturePath: textures,
  materials: ['red', 'green', 'yellow'],
  chunkDistance: 2
})