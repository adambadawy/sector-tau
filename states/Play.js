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
    },

    update: function() {
        var dx = this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X);
        var dy = this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y);
        if (Math.abs(dx) >= 0.1) { this.player.x += dx * 4; }
        if (Math.abs(dy) >= 0.1) { this.player.y += dy * 4; }
    },

    render: function() {
        /*
        this.game.debug.text(
            '' + (this.player.x | 0),
            3, 12,
            '#fff'
        );
        // */
    }
};
