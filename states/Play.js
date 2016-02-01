RENAME_ME.Play = function(game) {
};

RENAME_ME.Play.prototype = {
    preload: function() {
        this.game.load.atlas(
            'sprites', 'images/sprites.png', 'images/sprites.json'
        );
    },

    create: function() {
        this.game.input.gamepad.start();
        this.pad = this.game.input.gamepad.pad1;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.time.desiredFps = 60;

        this.game.stage.backgroundColor = '#000';

        var ww = this.world.width;
        var wh = this.world.height;
        var hww = ww / 2;
        var hwh = wh / 2;

        this.player = this.createPlayerObj(hww, wh - 64, 'player1');

        var numGrumpies = 8;
        var spacing = 48;
        var margin = hww - ((numGrumpies * spacing) / 2);
        var i;
        this.grumpies = [];
        for (i = 0; i < numGrumpies; ++i) {
            this.grumpies.push(
                this.createGrumpy(margin + i * spacing, 48, 'enemy1')
            );
        }
    },

    createPlayerObj: function(x, y, id) {
        var obj = this.game.add.sprite(x, y, 'sprites');
        obj.animations.add('left', [id + 'Left']);
        obj.animations.add('main', [id]);
        obj.animations.add('right', [id + 'Right']);
        obj.animations.play('main');
        this.initObject(obj, 3.0);
        return obj;
    },

    createGrumpy: function(x, y, id) {
        var frames = [id + 'A', id + 'B'];
        return this.createObject2(x, y, 3.0, frames);
    },

    createObject1: function(x, y, scale, name) {
        var obj = this.game.add.sprite(x, y, 'sprites', name);
        this.initObject(obj, scale);
        return obj;
    },

    createObject2: function(x, y, scale, frames) {
        var obj = this.game.add.sprite(x, y, 'sprites');
        obj.animations.add('main', frames, 5, true);
        obj.animations.play('main');
        this.initObject(obj, scale);
        return obj;
    },

    initObject: function(obj, scale) {
        obj.smoothed = false;
        obj.scale.set(scale, scale);
        obj.anchor.set(0.5, 0.5);
        this.game.physics.enable(obj, Phaser.Physics.ARCADE);
        // obj.body.drag = 10000;
        // obj.body.maxVelocity = 60;
    },

    update: function() {
        var coeff = 3000;
        var drag = 15;
        var threshold = 0.01 * coeff;
        var ax = coeff * this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        var ay = coeff * this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
        var dragx = 0;
        var dragy = 0;
        if (ax <= -threshold) {
            this.player.animations.play('left');
        }
        else if (ax >= threshold) {
            this.player.animations.play('right');
        }
        else {
            ax = 0;
            dragx = this.calculateDrag(this.player.body.velocity.x, drag);
            this.player.animations.play('main');
        }
        if (Math.abs(ay) < threshold) {
            ay = 0;
            dragy = this.calculateDrag(this.player.body.velocity.y, drag);
        }
        this.player.body.acceleration.set(ax, ay);
        this.player.body.velocity.add(dragx, dragy);
        this.player.body.velocity.clamp(-150, 150);
    },

    // Calculates the drag for the given velocity component
    calculateDrag: function(vc, drag) {
        var dragc;
        if (vc > 0) {
            dragc = -(Math.min(vc, drag));
        }
        else if (vc < 0) {
            dragc = Math.min(-vc, drag);
        }
        else {
            dragc = 0;
        }
        return dragc;
    },

    /*
    render: function() {
        this.game.debug.text(
            'dx: ' + (this.player.body.velocity.x | 0) + '\ndy: ' + (this.player.body.velocity.y | 0),
            3, 12,
            '#fff'
        );
    }
    // */
};
