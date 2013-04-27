var inherits = require('inherits')
var events = require('events')
var _ = require('underscore')

module.exports = Highlighter

function Highlighter(game, opts) {
  if (!(this instanceof Highlighter)) return new Highlighter(game, opts)
  this.game = game
  opts = opts || {}
  var geometry = opts.geometry || new game.THREE.CubeGeometry(1, 1, 1)
  var material = opts.material || new game.THREE.MeshBasicMaterial({
    color: opts.color || 0x000000,
    wireframe: true,
    wireframeLinewidth: opts.wireframeLinewidth || 3,
    transparent: true,
    opacity: opts.wireframeOpacity || 0.5
  })
  this.mesh = new game.THREE.Mesh(geometry, material)
  this.distance = opts.distance || 10
  this.currVoxelPos // undefined when no voxel selected for highlight
  this.currVoxelAdj // undefined when no adjacent voxel selected for highlight
  this.adjacentAnimate = opts.adjacentAnimate
  // the adjacent highlight will be active when the following returns true
  // default: 'alt' control mapped in game.controls (e.g. hold <Ctrl> key)
  this.adjacentActive = opts.adjacentActive || function () { return game.controls.state.alt }

  // highlight cube 'easing' animation, called every tick if enabled
  var self = this
  if (opts.adjacentAnimate) game.on('tick', function (dt) {
    var target
    var rate
    if (self.currVoxelAdj) { // animate cube from existing anchor voxel to empty adjacent position
      target = [self.currVoxelAdj[0] + 0.5, self.currVoxelAdj[1] + 0.5, self.currVoxelAdj[2] + 0.5]
      rate = 15
    }
    else if (self.currVoxelPos) { // animate cube from empty adjacent position back to anchor voxel
      target = [self.currVoxelPos[0] + 0.5, self.currVoxelPos[1] + 0.5, self.currVoxelPos[2] + 0.5]
      rate = 30
    }
    else {
      return
    }
    var pos = self.mesh.position
    if (Math.abs(target[0] - pos.x) < .1
     && Math.abs(target[1] - pos.y) < .1
     && Math.abs(target[2] - pos.z) < .1) {
      pos.set(target[0], target[1], target[2])
      return // close enough to snap and be done
    }
    dt = dt / 1000 // usually around .016 seconds (60 FPS)
    pos.x += rate * dt * (target[0] - pos.x)
    pos.y += rate * dt * (target[1] - pos.y)
    pos.z += rate * dt * (target[2] - pos.z)
  })

  game.on('tick', _.throttle(this.highlight.bind(this), opts.frequency || 100))
}

inherits(Highlighter, events.EventEmitter)

Highlighter.prototype.highlight = function () {

  var cp = this.game.cameraPosition()
  var cv = this.game.cameraVector()
  var hit = this.game.raycastVoxels(cp, cv, this.distance)

  var removeAdjacent = function (self) { // remove adjacent highlight if any
    if (!self.currVoxelAdj) return
    self.emit('remove-adjacent', self.currVoxelAdj.slice())
    self.currVoxelAdj = undefined
  }

  // remove existing highlight if any
  if (!hit) {
    if (!this.currVoxelPos) return // already removed
    this.game.scene.remove(this.mesh)
    this.emit('remove', this.currVoxelPos.slice())
    this.currVoxelPos = undefined
    removeAdjacent(this)
    return
  }

  // highlight hit block
  var newVoxelPos = hit.voxel
  if (!this.currVoxelPos
    || newVoxelPos[0] !== this.currVoxelPos[0]
    || newVoxelPos[1] !== this.currVoxelPos[1]
    || newVoxelPos[2] !== this.currVoxelPos[2]) { // no current highlight or it moved

    // move instantly
    this.mesh.position.set(newVoxelPos[0] + 0.5, newVoxelPos[1] + 0.5, newVoxelPos[2] + 0.5)

    if (this.currVoxelPos) {
      this.emit('remove', this.currVoxelPos.slice()) // moved highlight
    }
    else {
      this.game.scene.add(this.mesh) // fresh highlight
    }
    this.emit('highlight', newVoxelPos.slice())
    this.currVoxelPos = newVoxelPos

    removeAdjacent(this)
  }

  // if in "place block" mode, highlight adjacent voxel instead
  if (!this.adjacentActive()) {
    removeAdjacent(this)
    // snap back if not animating
    if (!this.adjacentAnimate) this.mesh.position.set(newVoxelPos[0] + 0.5, newVoxelPos[1] + 0.5, newVoxelPos[2] + 0.5)
    return
  }

  // since we got here, we know we have a selected non-empty voxel
  // and with an empty adjacent voxel that we can work with
  var newVoxelAdj = hit.adjacent
  if (!this.currVoxelAdj
    || newVoxelAdj[0] !== this.currVoxelAdj[0]
    || newVoxelAdj[1] !== this.currVoxelAdj[1]
    || newVoxelAdj[2] !== this.currVoxelAdj[2]) { // no current adj highlight or it has moved

    if (this.adjacentAnimate) {
      // start at anchor block position, then ease to adjacent on async updates
      this.mesh.position.set(newVoxelPos[0] + 0.5, newVoxelPos[1] + 0.5, newVoxelPos[2] + 0.5)
    }
    else {
      // instant snap, no easing enabled
      this.mesh.position.set(newVoxelAdj[0] + 0.5, newVoxelAdj[1] + 0.5, newVoxelAdj[2] + 0.5)
    }

    if (this.currVoxelAdj) {
      this.emit('remove-adjacent', this.currVoxelAdj.slice()) // moved adjacent highlight
    }

    this.emit('highlight-adjacent', newVoxelAdj.slice())
    this.currVoxelAdj = newVoxelAdj
  }
}