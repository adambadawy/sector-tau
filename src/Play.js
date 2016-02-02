SECTOR_TAU.Play = function(game) {
};

SECTOR_TAU.Play.prototype = {
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

        this.player = this.createPlayer(hww, wh - 64, 'player1');

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

    createPlayer: function(x, y, id) {
        var obj = this.game.add.sprite(x, y, 'sprites');
        obj.animations.add('left', [id + 'Left']);
        obj.animations.add('main', [id]);
        obj.animations.add('right', [id + 'Right']);
        obj.animations.play('main');
        this.initObject(obj, 3.0);
        this.initShooter(obj, Phaser.Timer.SECOND * 0.5);
        obj.bullets = this.game.add.group();
        return obj;
    },

    setReloadTimer: function(obj) {
        this.game.time.events.add(obj.reloadTime, function() {
            obj.canShoot = true;
        });
    },

    createGrumpy: function(x, y, id) {
        var frames = [id + 'A', id + 'B'];
        return this.createObject2(x, y, 3.0, frames);
    },

    createBullet: function(x, y, dx, dy, id) {
        var obj = this.game.add.sprite(x, y, 'sprites', 'bullet' + id);
        this.initObject(obj, 2.0);
        obj.body.velocity.set(dx, dy);
        obj.checkWorldBounds = true;
        obj.outOfBoundsKill = true;
        return obj;
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
    },

    initShooter: function(obj, reloadTime) {
        obj.reloadTime = reloadTime;
        obj.canShoot = false;
        this.setReloadTimer(obj);
    },

    update: function() {
        this.updatePlayer();
        this.game.physics.arcade.overlap(this.player.bullets, this.grumpies);
    },

    updatePlayer: function() {
        var maxVel = 200;
        var coeff = 1200;
        var drag = 15;
        var threshold = 0.01 * coeff;

        var ax = coeff * this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        var ay = coeff * this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
        var dragx = 0;
        var dragy = 0;
        if (Math.abs(ax) < threshold) {
            ax = 0;
            dragx = this.calculateDrag(this.player.body.velocity.x, drag);
        }
        if (Math.abs(ay) < threshold) {
            ay = 0;
            dragy = this.calculateDrag(this.player.body.velocity.y, drag);
        }
        this.player.body.acceleration.set(ax, ay);
        this.player.body.velocity.add(dragx, dragy);
        this.player.body.velocity.clamp(-maxVel, maxVel);

        var vx = this.player.body.velocity.x;
        if (vx < -145) {
            this.player.animations.play('left');
        }
        else if (vx < 145) {
            this.player.animations.play('main');
        }
        else {
            this.player.animations.play('right');
        }

        if (this.player.canShoot) {
            if (this.pad.isDown(Phaser.Gamepad.XBOX360_A)) {
                this.playerShoot();
            }
        }
    },

    playerShoot: function() {
        var bulletX = this.player.x;
        var bulletY = this.player.top - 1;
        var bulletDY = -450;
        var ret = this.player.bullets.getFirstDead(false, bulletX, bulletY);
        if (ret === null) {
            this.player.bullets.add(
                this.createBullet(bulletX, bulletY, 0, bulletDY, 'Green')
            );
        }
        else {
            ret.body.velocity.set(0, bulletDY);
        }
        this.player.canShoot = false;
        this.setReloadTimer(this.player);
    },

    // Calculates the drag for the given velocity component for the player
    calculateDrag: function(vc, drag) {
        var dragc = 0;
        if (vc > 0) {
            dragc = -(Math.min(vc, drag));
        }
        else if (vc < 0) {
            dragc = Math.min(-vc, drag);
        }
        return dragc;
    },

    /*
    render: function() {
        this.game.debug.text(
            '' + this.player.bullets.length,
            3, 12,
            '#fff'
        );
    }
    // */
};
