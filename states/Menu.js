RENAME_ME = {};

RENAME_ME.Menu = function (game) {
};

RENAME_ME.Menu.prototype = {
    init: function() {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.game.orientated = true;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.maxWidth = this.game.width;
        this.scale.maxHeight = this.game.height;
    },

    create: function () {
        this.game.input.gamepad.start();
        this.pad = this.game.input.gamepad.pad1;

        this.game.stage.backgroundColor = '#000';

        var menuX = this.world.width / 2;
        var menuPos = this.world.height / 4;

        var title = this.game.add.text(
            menuX,
            menuPos,
            'RENAME_ME',
            { fill: '#fff', fontSize: 72 }
        );
        title.anchor.set(0.5, 0.5);

        var pressAtk = this.game.add.text(
            menuX,
            menuPos + 100,
            'Press ATTACK!',
            { fill: '#fff', fontSize: 32 }
        );
        pressAtk.alpha = 0;
        pressAtk.anchor.set(0.5, 0.5);

        var fBlink = function() {
            if (pressAtk.alpha < 0.001) {
                pressAtk.alpha = 1;
            }
            else {
                pressAtk.alpha = 0;
            }
        };
        this.game.time.events.loop(Phaser.Timer.SECOND * 0.8, fBlink, this);
    },

    update: function() {
        if (this.pad.justPressed(Phaser.Gamepad.XBOX360_A)) {
            this.state.start('Play');
        }
    }
};
