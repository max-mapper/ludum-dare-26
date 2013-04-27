var createEngine = require('voxel-engine')
var game = createEngine({
    generate: function(x, y, z) {
        if (x*x + y*y + z*z > 20*20) return 0;
        return Math.floor(Math.random() * 4) + 1;
    },
    texturePath: './',
    materials: [ 'dirt', 'grass', 'crate', 'brick' ]
});
game.controls.pitchObject.rotation.x = -1.5
game.appendTo('#container');

var explode = require('voxel-debris')(game, { power : 1.5 });

explode.on('collect', function (item) {
    console.log(game.materials[item.value - 1]);
});

game.on('mousedown', function (pos) {
    if (erase) explode(pos)
    else game.createBlock(pos, 1)
});

window.addEventListener('keydown', ctrlToggle);
window.addEventListener('keyup', ctrlToggle);

var erase = true
function ctrlToggle (ev) { erase = !ev.ctrlKey }
game.requestPointerLock('canvas');

for (var i = 0; i < 10; i++) {
    game.addItem(createCreature(0, 550, 0));
}

function createCreature (x, y, z) {
    var material = game.loadTextures([ 'obsidian' ]);
    var mesh = new game.THREE.Mesh(
        new game.THREE.CubeGeometry(10, 30, 10),
        material
    );
    mesh.geometry.faces.forEach(function (face) {
        face.materialIndex = 0;
    });
    mesh.translateX(x);
    mesh.translateY(y);
    mesh.translateZ(z);
    
    var item = {
        mesh: mesh,
        width: 10,
        height: 30,
        depth: 10,
        collisionRadius: 20,
        velocity: { x: 0, y: 0, z: 0 }
    };
    
    setTimeout(function () {
        setInterval(interval, 2000);
    }, Math.random() * 2000);
    
    function interval () {
        if (item.velocity.y > 0.01) return;
        item.velocity.y += 0.1;
        item.velocity.x += (2 * Math.random() - 1) / 40;
        item.velocity.z += (2 * Math.random() - 1) / 40;
        mesh.translateY(5);
        item.resting = false;
    }
    
    return item;
}
