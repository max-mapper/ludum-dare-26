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

creature.on('frolic', function () {
    creature.rotation.y += Math.random() * Math.PI / 2 - Math.PI / 4;
    creature.move(0, 0, 0.5 * Math.random());
});

creature.on('collide', function (player) {
    console.log('COLLIDE');
});
