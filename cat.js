var physical = require('voxel-physical');

module.exports = function (game) {
    return function () {
        return new Cat(game)
    }
}

function Cat (game) {
    this.game = game
    var T = game.THREE
    
    var body = new T.Object3D
    
    var abdomen = new T.Mesh(
        new T.CubeGeometry(10, 10, 10),
        new T.MeshLambertMaterial({
            color: 0x200830,
            ambient: 0x200830
        })
    );
    abdomen.position.set(0, 10, 0)
    body.add(abdomen)
    
    var head = new T.Mesh(
        new T.CubeGeometry(5, 5, 5),
        new T.MeshLambertMaterial({
            color: 0x200830,
            ambient: 0x200830
        })
    );
    head.position.set(0, 8, 7.5)
    body.add(head)
    
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
    eyes[0].position.set(1.5, 9, 10);
    eyes[1].position.set(-1.5, 9, 10);
    
    var legs = [];
    for (var side = 0; side <= 1; side++) {
        for (var i = 0; i < 4; i++) {
            var leg = new T.Object3D;
            leg.position.z = i * 1.5;
            leg.state = i % 2;
            leg.position.y = leg.state + 3;
            
            legs.push(leg);
            body.add(leg);
            
            var horiz = new T.Mesh(
                new T.CubeGeometry(5, 1, 1),
                new T.MeshLambertMaterial({
                    color: 0x200830,
                    ambient: 0x200830
                })
            );
            horiz.position.x = 7.5 - side * 15;
            horiz.position.y = 4;
            leg.add(horiz);
            
            var vert = new T.Mesh(
                new T.CubeGeometry(1, 5, 1),
                new T.MeshLambertMaterial({
                    color: 0x200830,
                    ambient: 0x200830
                })
            );
            vert.position.x = 10 - side * 20;
            vert.position.y = 1.5;
            leg.add(vert);
        }
    }
    setInterval(function () {
        legs.forEach(function (leg) {
            leg.state = !leg.state;
            leg.position.y = leg.state + 3;
        });
    }, 100);
    
    var dims = new T.Vector3(10, 10, 10);

    return body
}
