var id = ~~(Math.random() * 10000) + '' + ~~(Math.random() * 10000)
// var peer = new Peer(id, {host: 'localhost', port: 9000})
// window.peer = peer
console.log(id)

// peer.on('connection', function(conn) {
//   console.log('connection', conn)
//   conn.on('data', function(data) {
//     console.log(data)
//   })
// })

var b = [[-64, -32], [64, 32]]
var height = 5
var dimensions = [b[0][1] - b[0][0], b[1][1] - b[1][0]]

var highlight = require('voxel-highlight')
var createGame = require('voxel-hello-world')
createGame({
  materials: ['blue', 'red'],
  chunkDistance: 4,
  fogDisabled: true,
  generate: function(x, y, z) {
    if (b[0][0] < x && x < b[1][0] && b[0][1] < z && z < b[1][1] && y === 0) return 1
    if (x === b[1][0] && z >= b[0][1] && z < b[1][1] && y >= 0 && y <= height) return 4
    if (x === b[0][0] && z >= b[0][1] && z < b[1][1] && y >= 0 && y <= height) return 4
    if (z === b[1][1] && x >= b[0][0] && x < b[1][0] && y >= 0 && y <= height) return 4
    if (z === b[0][1] && x >= b[0][0] && x < b[1][0] && y >= 0 && y <= height) return 4
    return 0
  }
}, setup)

function setup(game, avatar) {
  addLights(game)

  avatar.position.copy({x: 2, y: 6, z: 4})
  game.voxels.removeAllListeners('missingChunk')
  
  var blockPosPlace, blockPosErase
  var hl = game.highlighter = highlight(game, { color: 0xFF0000, distance: 100, wireframeLinewidth: 5 })
  hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos })
  hl.on('remove', function (voxelPos) { blockPosErase = null })
  hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos })
  hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null })
  
  game.on('fire', function (target, state) {
    var select = game.controls.state.select

    var position = blockPosPlace
    if (position) {
      game.createBlock(position, 'red')
    } else {
      position = blockPosErase
      if (position) game.setBlock(position, 0)
    }
  })
}

function addLights(game) {
  var gg = new game.THREE.PlaneGeometry( 16000, 16000 )
  var gm = new game.THREE.MeshBasicMaterial( { color: 0xdff2fc } )

  var ground = new game.THREE.Mesh( gg, gm )
  ground.rotation.x = - Math.PI / 2
  ground.receiveShadow = true

  game.scene.add( ground )
  game.view.renderer.setClearColor(0xffffff, 1)
}