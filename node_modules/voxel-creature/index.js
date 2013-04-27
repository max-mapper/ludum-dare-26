var inherits = require('inherits');
var EventEmitter = require('events').EventEmitter;

module.exports = function (game) {
    return function (obj, opts) {
        return new Creature(game, obj, opts);
    };
};

inherits(Creature, EventEmitter);

function Creature (game, obj, opts) {
    var T = game.THREE;
    this.game = game;
    
    if (!opts) opts = {};
    var force = opts.force || [ 0, -0.00009, 0 ];
    if (Array.isArray(force)) {
        force = new T.Vector3(force[0], force[1], force[2]);
    }
    else force = new T.Vector3(force.x, force.y, force.z);
    
    var dims = opts.dims || new T.Vector3(10, 10, 10);
    this.item = game.makePhysical(obj, dims);
    this.item.subjectTo(force);
    game.scene.add(obj);
    game.addItem(this.item);
    
    this.position = this.item.yaw.position;
    this.rotation = this.item.yaw.rotation;
}

Creature.prototype.jump = function (x) {
    if (x === undefined) x = 1;
    this.move(0, x, 0);
};

Creature.prototype.move = function (x, y, z) {
    var game = this.game;
    var T = game.THREE;
    
    if (typeof x === 'object' && Array.isArray(x)) {
        y = x[1]; z = x[2]; x = x[0];
    }
    if (typeof x === 'object') {
        y = x.y; z = x.z; x = x.x;
    }
    this.item.velocity.x += x;
    this.item.velocity.y += y;
    this.item.velocity.z += z;
    
    if (this.item.velocity.y === 0) {
        var angle = this.rotation.y;
        var pt = this.position.clone();
        pt.x += game.cubeSize / 2 * Math.sin(angle);
        pt.z += game.cubeSize / 2 * Math.cos(angle);
        if (game.getBlock(pt)) this.emit('block');
    }
};

Creature.prototype.lookAt = function (obj) {
    var a = obj.position || obj;
    var b = this.position;
    
    this.item.yaw.rotation.y = Math.atan2(a.x - b.x, a.z - b.z)
        + Math.random() * 1 / 4 - 1 / 8
    ;
};

Creature.prototype.notice = function (target, opts) {
    var self = this;
    if (!opts) opts = {};
    if (opts.radius === undefined) opts.radius = 500;
    if (opts.collisionRadius === undefined) opts.collisionRadius = 25;
    if (opts.interval === undefined) opts.interval = 1000;
    var pos = target.position || target;
    
    return setInterval(function () {
        var dist = self.position.distanceTo(pos);
        if (dist < opts.collisionRadius) {
            self.emit('collide', target);
        }
        
        if (dist < opts.radius) {
            self.noticed = true;
            self.emit('notice', target);
        }
        else {
            self.noticed = false;
            self.emit('frolic', target);
        }
    }, opts.interval);
};
