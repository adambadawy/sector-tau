FONT_TITLE = 'PT Sans Narrow';
FONT_OTHER = 'Source Code Pro';

WebFontConfig = {
    active: function() {},
    google: {
        families: [FONT_TITLE, FONT_OTHER]
    }
};

SECTOR_TAU = {};

SECTOR_TAU.Menu = function (game) {
};

SECTOR_TAU.Menu.prototype = {
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

    preload: function() {
        this.game.stage.backgroundColor = '#000';

        this.loadingText = this.game.add.text(
            this.world.width / 2, this.world.height / 2,
            'LθADING',
            { fill: '#fff', fontSize: 24 }
        );
        this.loadingText.anchor.set(0.5, 0.5);

        this.game.load.script(
            'webfont',
            '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js'
        );
        this.game.load.atlas(
            'sprites', 'res/sprites.png', 'res/sprites.min.json'
        );

        var soundFilenames = [
            'boss.ogg', 'damage1.wav', 'destroy1.wav', 'hullup.wav',
            'menu.ogg', 'scoreup.wav', 'shot1.wav', 'shot2.wav', 'shot3.wav',
            'waves1.ogg', 'waves2.ogg', 'win.ogg'
        ];
        soundFilenames.forEach(function(name) {
            this.game.load.audio(name, 'res/' + name);
        }, this);

        this.game.input.gamepad.start();
        this.pad = this.game.input.gamepad.pad1;
    },

    create: function () {
        this.loadingText.destroy();

        this.menuMusic = this.game.add.audio('menu.ogg');
        this.menuMusic.play('', 0, 1, true);

        var wh = this.world.height;
        var menuX = this.world.width / 2;
        var menuPos = wh / 4;

        this.title = this.game.add.text(
            menuX, menuPos, 'SECTθR TAU',
            { fill: '#fff', font: FONT_TITLE, fontSize: 98 }
        );
        this.title.anchor.set(0.5, 0.5);

        this.pressAtk = this.game.add.text(
            menuX, menuPos + 100, 'Press ATTACK!',
            { fill: '#fff', font: FONT_OTHER, fontSize: 32, fontStyle: 'bold' }
        );
        this.pressAtk.alpha = 0;
        this.pressAtk.anchor.set(0.5, 0.5);

        var helpMsg =
            'One bullet costs one point. Shooting an enemy earns one point.\n' +
            'Destroying an enemy earns many points. Each thousand points increases\n' +
            "your ship's hull integrity. If hull integrity falls to zero, game over.\n\n" +

            'CONTROLS\n' +
            'Gamepad:  Move with left stick, attack with A\n' +
            'Keyboard: Move with WASD, attack with spacebar\n' +
            'F5 is the reset button. ;)';
        this.helpText = this.game.add.text(
            6, this.world.height, helpMsg,
            { fill: '#fff', font: FONT_OTHER, fontSize: 18, fontStyle: 'bold' }
        );
        this.helpText.anchor.set(0, 1);

        var fBlink = function() {
            if (this.pressAtk.alpha < 0.001) {
                this.pressAtk.alpha = 1;
            }
            else {
                this.pressAtk.alpha = 0;
            }
        };
        this.game.time.events.loop(Phaser.Timer.SECOND * 0.8, fBlink, this);
    },

    update: function() {
        var spaceDown =
            this.game.input.keyboard.isDown(Phaser.KeyCode.SPACEBAR);
        var aDown = this.pad.isDown(Phaser.Gamepad.XBOX360_A);
        if (spaceDown || aDown) {
            this.helpText.destroy();
            this.pressAtk.destroy();
            this.title.destroy();
            this.menuMusic.destroy();

            this.state.start('Play');
        }
    }
};
