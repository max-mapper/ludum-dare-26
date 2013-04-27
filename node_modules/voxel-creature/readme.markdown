# voxel-creature

create creatures for [voxel.js](http://voxeljs.com)

# example

``` js
var createGame = require('voxel-engine');
var voxel = require('voxel');
var game = createGame({
    generate: voxel.generator['Valley'],
    texturePath: '/textures/'
});
game.appendTo('#container');

var createPlayer = require('voxel-player')(game);
var substack = createPlayer('substack.png');
substack.possess();
window.substack = substack;

window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) {
        substack.toggle();
    }
});

var createCreature = require('../')(game);
var creature = createCreature((function () {
    var T = game.THREE;
    var body = new T.Object3D;
    
    var head = new T.Mesh(
        new T.CubeGeometry(10, 10, 10),
        new T.MeshLambertMaterial({
            color: 0x800830,
            ambient: 0x800830
        })
    );
    head.position.set(0, 5, 0);
    body.add(head);
    
    var eyes = [0,1].map(function () {
        var eye = new T.Mesh(
            new T.CubeGeometry(1, 1, 1),
            new T.MeshLambertMaterial({
                color: 0xffffff,
                ambient: 0xffffff
            })
        );
        body.add(eye);
        return eye;
    });
    eyes[0].position.set(2, 8, 5);
    eyes[1].position.set(-2, 8, 5);
    
    return body;
})());
window.creature = creature;
 
creature.position.y = 200;
creature.position.x = Math.random() * 300 - 150;
creature.position.z = Math.random() * 300 - 150;

creature.on('block', function () { creature.jump() });
creature.notice(substack, { radius: 500 });

creature.on('notice', function (player) {
    creature.lookAt(player);
    creature.move(0, 0, 0.5);
});

setInterval(function () {
    if (creature.noticed) return;
    creature.rotation.y += Math.random() * Math.PI / 2 - Math.PI / 4;
    creature.move(0, 0, 0.5 * Math.random());
}, 1000);
```

# methods

``` js
var voxelCreature = require('voxel-creature')
```

## var createCreature = voxelCreature(game)

Return a function `createCreature` for making creatures given a
[voxel-engine](https://github.com/maxogden/voxel-engine) `game` instance.

## var creature = createCreature(obj, opts={})

Create a creature with the three.js 3d object (use game.THREE) `obj`.

Control the bounding box size with a vector3 `opts.dims` and the force
(like gravity) for the object to be subject to with `opts.force`.

The default `opts.dims` is `[10,10,10]`.
The default `opts.force` is `[0,-0.00009,0]`.

## creature.jump(power=1)

Jump upward.

## creature.move(x, y, z)

Move the creature `[x,y,z]` smoothly by altering its velocity.

## creature.lookAt(target)

Turn toward the 3d object `target`.
`target` should be a 3d vector itself or it should have a `target.position`.

## creature.notice(target, opts)

Return an interval for detecting the presence of `target`.
`target` should be a 3d vector itself or it should have a `target.position`.

The `opts.radius` controls how nearby `target` needs to be to trigger a
`'notice'` event. Otherwise `'frolic'` events fire.
The default `opts.radius` is `500`.

The `opts.collisionRadius` controls how nearby `target` needs to be to trigger a
`'collide'` event.
The default `opts.collisionRadius` is `25`.

The `opts.interval` controls how often to check the distance to `target`.
The default `opts.interval` is `1000`.

# events

## creature.on('notice', function (target) {})

When `target` is within the radius configured by `creature.notice()`, the
`'notice'` event fires.

## creature.on('collide', function (target) {})

When `target` is within the collision radius configured in `creature.notice()`,
the `'collide'` event fires.

## creature.on('block', function () {})

When a creature is constrained by a block in front of it, the `'block'` event
fires. A good thing to try when a creature is blocked is to jump.

# attributes

## creature.position

control the creature item position

## creature.rotation

control the creature item rotation

# install

With [npm](https://npmjs.org) do:

```
npm install voxel-creature
```

# license

MIT
