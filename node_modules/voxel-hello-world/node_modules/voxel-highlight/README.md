# voxel-highlight

highlight the voxel the player is currently looking at, along with the
adjacent voxel (where a block would be placed) when the control key is down

```
npm install voxel-highlight
```

or just add to the package.json file of your voxel-engine project

## example

```javascript
var highlight = require('voxel-highlight')
var highlighter = highlight(game)
highlighter.on('highlight', function (voxelPosArray) {
  console.log('highlighted voxel: ' + voxelPosArray)
})
```
or using as constructor:
```javascript
var Highlight = require('voxel-highlight')
var highlighter = new Highlight(game)
```

### highlight(gameInstance, optionalOptions)

options can be:

```javascript
{
  frequency: how often in milliseconds to highlight, default is 100
  distance: how far in game distance things should be highlighted, default is 10
  geometry: threejs geometry to use for the highlight, default is a cubegeometry
  material: material to use with the geometry, default is a wireframe
  wireframeLinewidth: if using default material wireframe, default is 3
  wireframeOpacity: if using default material wireframe, default is 0.5
  color: highlight cube color, default is 0x000000
  adjacentAnimate: animate movement of highlight cube to/from adjacent position
  adjacentActive: function to toggle adjacent highlight, default is { return game.controls.state.alt }
}
```

### highlighter.on('highlight', function(voxelPosArray) {})

called when a voxel is highlighted

### highlighter.on('remove', function(voxelPosArray) {})

called when a voxel is un-highlighted

### highlighter.on('highlight-adjacent', function(voxelPosArray) {})

called when an adjacent voxel is highlighted

### highlighter.on('remove-adjacent', function(voxelPosArray) {})

called when an adjacent voxel is un-highlighted

# Get the demo running on your machine

check out [voxel-hello-world](http://github.com/maxogden/voxel-hello-world) for demo usage

## license

BSD
