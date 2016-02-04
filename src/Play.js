SECTOR_TAU.Play = function(game) {
};

SECTOR_TAU.Play.prototype = {
    create: function() {
        this.game.input.gamepad.start();
        this.pad = this.game.input.gamepad.pad1;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.stage.backgroundColor = '#000';

        var ww = this.world.width;
        var wh = this.world.height;
        var hww = ww / 2;
        var hwh = wh / 2;

        this.bakeMovements();

        this.NUM_WAVES = 14;
        this.ENEMY_SPACING = 64;

        this.sfx = {};
        this.sfx.damage1 = this.game.add.sound('damage1.wav');
        this.sfx.damage1.volume = 2.0;
        this.sfx.destroy1 = this.game.add.sound('destroy1.wav');
        this.sfx.destroy1.volume = 2.0;
        this.sfx.hullup = this.game.add.sound('hullup.wav');
        this.sfx.scoreup = this.game.add.sound('scoreup.wav');
        this.sfx.shot1 = this.game.add.sound('shot1.wav');
        this.sfx.shot1.volume = 0.5;
        this.sfx.shot2 = this.game.add.sound('shot2.wav');
        this.sfx.shot3 = this.game.add.sound('shot3.wav');
        this.sfx.shot3.volume = 0.85;
        this.sfx.scoreup.volume = 0.45;

        this.music = {};
        this.music.boss = this.game.add.audio('boss.ogg');
        this.music.waves1 = this.game.add.audio('waves1.ogg');
        this.music.waves2 = this.game.add.audio('waves2.ogg');
        this.music.win = this.game.add.audio('win.ogg');
        this.music.current = this.music.waves1;

        this.player = this.createPlayer(hww, wh - 64, 'player1');
        this.boss = null;

        this.wave = 0;
        this.waveText = this.game.add.text(
            hww, hwh, 'OOPS',
            { fill: '#fff', font: FONT_TITLE, fontSize: 72 }
        );
        this.waveText.anchor.set(0.5, 0.5);
        this.waveText.visible = false;

        this.grumpies = this.game.add.group();
        this.grumpyBullets = this.game.add.group();

        this.score = 0;
        this.maxScore = 0;
        this.hudText = this.game.add.text(
            4, 0, 'OOPS',
            { fill: '#fff', font: FONT_OTHER, fontSize: 32, fontStyle: 'bold' }
        );
        this.hudText.shown = 0;
        this.updateHudText();

        this.game.time.events.loop(
            Phaser.Timer.SECOND * 0.05, this.updateShownScore, this
        );

        this.game.time.events.loop(
            Phaser.Timer.SECOND * 0.08, this.flickerUpdate, this
        );

        this.game.time.events.loop(
            Phaser.Timer.SECOND * 1.5, this.grumpyShoot, this
        );
    },

    playMusic: function(m, loop) {
        if (typeof loop === 'undefined') loop = true;
        this.music.current.stop();
        m.play('', 0, 1, loop);
        this.music.current = m;
    },

    bakeMovements: function() {
        var w = this.world.width;
        var h = this.world.height;
        Movement.grumpy1 = Movement.bakeGrumpy1(w, h);
        Movement.grumpy2 = Movement.bakeGrumpy2(w, h);
        Movement.grumpy3 = Movement.bakeGrumpy3(w, h);
        Movement.boss1 = Movement.bakeBoss1(w, h);
    },

    makeWave: function(n) {
        switch (n) {
            case 1:
                this.makeGrumpy1Subgroup(5, 0);
                break;

            case 2:
                this.makeGrumpy2Subgroup(4, 9);
                break;

            case 3:
                this.makeGrumpy1Subgroup(4, 0);
                this.makeGrumpy3Subgroup(2);
                break;

            case 4:
                this.makeGrumpy1Subgroup(6, 0);
                this.makeGrumpy2Subgroup(3, 3);
                this.makeGrumpy2Subgroup(3, 9, 1);
                break;

            case 5:
                this.makeGrumpy1Subgroup(12, 0);
                this.makeGrumpy2Subgroup(5, 9);
                this.makeGrumpy3Subgroup(3);
                this.makeGrumpy3Subgroup(3, 20);
                break;

            case 6:
                this.makeGrumpy1Subgroup(12, 0);
                this.makeGrumpy2Subgroup(3, 9);
                this.makeGrumpy3Subgroup(5);
                break;

            case 7:
                this.boss = this.createBoss1();
                break;

            case 8:
                this.makeGrumpy3Subgroup(2);
                this.makeGrumpy3Subgroup(2, 20);
                this.makeGrumpy2Subgroup(4, 3, 2);
                this.makeGrumpy2Subgroup(8, 9);
                break;

            case 9:
                this.makeGrumpy1Subgroup(12, 0);
                this.makeGrumpy1Subgroup(12, 1, 4);
                this.makeGrumpy3Subgroup(3);
                break;

            case 10:
                this.makeGrumpy2Subgroup(8, 0);
                this.makeGrumpy2Subgroup(4, 1, 4);
                this.makeGrumpy3Subgroup(5);
                break;

            case 11:
                this.makeGrumpy2Subgroup(4, 0);
                this.makeGrumpy2Subgroup(4, 4, 2);
                this.makeGrumpy1Subgroup(8, 0);
                this.makeGrumpy1Subgroup(8, 4, 1);
                break;

            case 12:
                this.makeGrumpy2Subgroup(4, 4);
                this.makeGrumpy2Subgroup(4, 8, 2);
                this.makeGrumpy3Subgroup(8);
                this.makeGrumpy1Subgroup(8, 8, 1);
                break;

            case 13:
                this.makeGrumpy1Subgroup(18, 0, 20);
                this.makeGrumpy3Subgroup(1);
                this.makeGrumpy2Subgroup(8, 9, 20);
                this.makeGrumpy3Subgroup(12, 30);
                break;

            case 14:
                this.boss = this.createBoss2();
                break;

            default: console.log('OOPS');
        }
    },

    makeGrumpy1Subgroup: function(n, yOffs, blanks) {
        if (typeof blanks === 'undefined') blanks = 0;
        var y = 48 + yOffs * this.ENEMY_SPACING;
        var margin = -((n + blanks) * this.ENEMY_SPACING);
        var i;
        for (i = 0; i < n; ++i) {
            this.grumpies.add(
                this.createGrumpy1(margin + i * this.ENEMY_SPACING, y)
            );
        }
    },

    makeGrumpy2Subgroup: function(n, xOffs, blanks) {
        if (typeof blanks === 'undefined') blanks = 0;
        var x = 48 + xOffs * this.ENEMY_SPACING;
        var margin = -((n + blanks) * this.ENEMY_SPACING);
        var i;
        for (i = 0; i < n; ++i) {
            this.grumpies.add(
                this.createGrumpy2(x, margin + i * this.ENEMY_SPACING)
            );
        }
    },

    makeGrumpy3Subgroup: function(n, blanks) {
        if (typeof blanks === 'undefined') blanks = 0;
        var x = 48;
        var margin = -((n + blanks) * this.ENEMY_SPACING);
        var i;
        for (i = 0; i < n; ++i) {
            this.grumpies.add(
                this.createGrumpy3(x, margin + i * this.ENEMY_SPACING)
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
        obj.body.collideWorldBounds = true;
        obj.health = 3;
        obj.healthEarned = 0;
        obj.flickerTimer = null;
        this.initShooter(obj, Phaser.Timer.SECOND * 0.1);
        obj.bullets = this.game.add.group();
        obj.events.onKilled.add(function() {
            this.waveText.text = 'GAME θVER';
            this.waveText.bringToTop();
            this.waveText.visible = true;
        }, this);
        obj.body.setSize(12, 8, 1, 1);
        return obj;
    },

    setReloadTimer: function(obj) {
        this.game.time.events.add(obj.reloadTime, function() {
            obj.canShoot = true;
        });
    },

    createBoss: function(id, health, moveFunc, value, updateFunc) {
        var obj = this.createObject1(this.world.width / 2, -128, 3.0, id);
        this.initEnemy(obj, health, moveFunc, value);
        obj.updateFunc = updateFunc;
        obj.goons = this.game.add.group();
        obj.bossTick = 0;
        return obj;
    },

    createGrumpy: function(x, y, id, health, moveFunc, value) {
        var frames = [id + 'A', id + 'B'];
        var obj = this.createObject2(x, y, 3.0, frames);
        this.initEnemy(obj, health, moveFunc, value);
        return obj;
    },

    initEnemy: function(obj, health, moveFunc, value) {
        obj.moveState = -1;
        obj.moveFunc = moveFunc;
        obj.health = health;
        obj.flickerTimer = null;
        obj.events.onKilled.add(function() {
            this.addScore(value);
            this.sfx.destroy1.play();
        }, this);
    },

    createBoss1: function() {
        return this.createBoss(
            'boss1', 300, Movement.boss1, 1200, this.updateBoss1
        );
    },

    createBoss2: function() {
        return this.createBoss(
            'boss2', 500, Movement.boss1, 3000, this.updateBoss2
        );
    },

    updateBoss1: function() {
        var health = this.boss.health;
        var tick = this.boss.bossTick;
        if (health < 100) {
            if (tick % 20 === 0) {
                this.grumpyShootOne(this.boss);
            }
        }
        else if (health < 200) {
            if (tick % 30 === 0) {
                this.grumpyShootOne(this.boss);
            }
        }
        else {
            if (tick % 45 === 0) {
                this.grumpyShootOne(this.boss);
            }
        }
    },

    updateBoss2: function() {
        var health = this.boss.health;
        var tick = this.boss.bossTick;
        if (health < 100) {
            if (tick % 12 === 0) {
                this.grumpyShootOne(this.boss);
            }
        }
        else if (health < 200) {
            if (tick % 15 === 0) {
                this.grumpyShootOne(this.boss);
            }
        }
        else if (health < 300) {
            if (tick % 18 === 0) {
                this.grumpyShootOne(this.boss);
            }
        }
        else if (health < 400) {
            if (tick % 21 === 0) {
                this.grumpyShootOne(this.boss);
            }
        }
        else {
            if (tick % 24 === 0) {
                this.grumpyShootOne(this.boss);
            }
        }
    },

    createGrumpy1: function(x, y) {
        return this.createGrumpy(x, y, 'enemy1', 4, Movement.grumpy1, 60);
    },

    createGrumpy2: function(x, y) {
        return this.createGrumpy(x, y, 'enemy2', 8, Movement.grumpy2, 80);
    },

    createGrumpy3: function(x, y) {
        return this.createGrumpy(x, y, 'enemy3', 3, Movement.grumpy3, 80);
    },

    createBullet: function(x, y, id, scale) {
        var obj = this.game.add.sprite(x, y, 'sprites', 'bullet' + id);
        this.initObject(obj, scale);
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
        this.updateWave();

        this.doCollision();

        if (this.player.alive) {
            this.updatePlayer();
        }

        if (this.boss !== null) {
            if (!this.boss.alive) {
                this.boss.goons.destroy();
                this.boss = null;
            }
            else {
                this.boss.moveFunc(this.boss);
                this.boss.updateFunc.call(this);
                this.boss.bossTick = (this.boss.bossTick + 1) % 1000000;
            }
        }

        var w = this.world.width;
        var h = this.world.height;
        this.grumpies.forEachAlive(function(grumpy) {
            grumpy.moveFunc(grumpy);
        }, this);

        this.updateHudText();
    },

    updateWave: function() {
        if (this.waveText.visible) {
            return;
        }
        if (this.boss === null && this.grumpies.getFirstAlive() === null) {
            this.grumpyBullets.forEachAlive(function(bullet) {
                bullet.kill();
            }, null);
            this.grumpies.removeAll(true);

            this.wave++;
            this.waveText.text = this.getWaveName(this.wave);
            this.waveText.bringToTop();
            this.waveText.visible = true;

            this.updateMusic();

            if (this.wave > this.NUM_WAVES) {
                return;
            }

            this.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                this.makeWave(this.wave);
                this.waveText.visible = false;
            }, this);
        }
    },

    updateMusic: function() {
        if (this.wave == 1) {
            this.playMusic(this.music.waves1);
        }
        if (this.wave == 7) {
            this.playMusic(this.music.boss);
        }
        if (this.wave == 8) {
            this.playMusic(this.music.waves2);
        }
        if (this.wave == 14) {
            this.playMusic(this.music.boss);
        }
        if (this.wave == 15) {
            this.playMusic(this.music.win, false);
        }
    },

    grumpyShoot: function() {
        this.grumpies.forEachAlive(this.grumpyShootOne, this);
    },

    grumpyShootOne: function(grumpy) {
        var bullet = this.getBulletForPool(
            this.grumpyBullets, grumpy.x, grumpy.y, 'White', 3.0
        );
        this.game.physics.arcade.velocityFromRotation(
            this.game.physics.arcade.angleBetween(grumpy, this.player),
            200,
            bullet.body.velocity
        );
    },

    getWaveName: function(n) {
        switch (n) {
            case 1: return 'WAVE θNE';
            case 2: return 'WAVE TWθ';
            case 3: return 'WAVE THREE';
            case 4: return 'WAVE FθUR';
            case 5: return 'WAVE FIVE';
            case 6: return 'WAVE SIX';
            case 7: return 'BθSS WAVE';
            case 8: return 'WAVE EIGHT';
            case 9: return 'WAVE NINE';
            case 10: return 'WAVE TEN';
            case 11: return 'WAVE ELEVEN';
            case 12: return 'WAVE TWELVE';
            case 13: return 'WAVE THIRTEEN';
            case 14: return 'FINAL BθSS';
            case 15: return 'YθU WθN!'
        }
    },

    addScore: function(amt) {
        this.score = Math.max(Math.min(this.score + amt, 9999999), 0);
    },

    updateShownScore: function() {
        if (this.hudText.shown === this.score) {
            return;
        }
        if (this.hudText.shown < this.score - 100) {
            this.hudText.shown += 60;
            this.sfx.scoreup.play();
        }
        else if (this.hudText.shown < this.score - 10) {
            this.hudText.shown += 10;
            this.sfx.scoreup.play();
        }
        else if (this.hudText.shown < this.score) {
            this.hudText.shown += 1;
            this.sfx.scoreup.play();
        }
        else { // if the score is lower than shown, just jump to that value
            this.hudText.shown = this.score;
        }
        if (this.hudText.shown > (this.player.healthEarned + 1) * 1000) {
            this.player.health += 1;
            this.player.healthEarned += 1;
            this.sfx.hullup.play();
        }
    },

    updateHudText: function() {
        this.hudText.text =
            'Score: ' + ('       ' + this.hudText.shown).slice(-7) + '    ' +
            'Hull: ' + ('  ' + this.player.health).slice(-2) + '    ' +
            'Wave: ' + ('  ' + Math.min(this.wave, this.NUM_WAVES)).slice(-2);
        this.hudText.bringToTop();
    },

    doCollision: function() {
        this.game.physics.arcade.overlap(
            this.boss, this.player.bullets, this.doCollisionBulletEnemy,
            null, this
        );
        this.game.physics.arcade.overlap(
            this.grumpies, this.player.bullets, this.doCollisionBulletEnemy,
            null, this
        );

        this.game.physics.arcade.overlap(
            this.player, this.grumpies,
            this.doCollisionPlayerGrumpy, null, this
        );
        this.game.physics.arcade.overlap(
            this.player, this.grumpyBullets,
            this.doCollisionPlayerBullet, null, this
        );
    },

    doCollisionBulletEnemy: function(enemy, bullet) {
        bullet.kill();
        enemy.damage(1);
        this.setDamaged(enemy, Phaser.Timer.SECOND * 0.5);
        this.addScore(1);
    },

    doCollisionPlayerGrumpy: function(_player, grumpy) {
        if (this.player.flickerTimer === null) {
            this.badPlayerCollision();
        }
    },

    doCollisionPlayerBullet: function(_player, bullet) {
        if (this.player.flickerTimer === null) {
            bullet.kill();
            this.badPlayerCollision();
        }
    },

    // Some common code in all collisions that are unfortunate for the player
    badPlayerCollision: function() {
        this.sfx.damage1.play();
        this.player.damage(1);
        this.setDamaged(this.player, Phaser.Timer.SECOND);
    },

    updatePlayer: function() {
        var coef = 3600;
        var coefY = 2 / 3;
        var maxDX = 360;
        var maxDY = maxDX * coefY;
        var drag = 25;

        var input = new Phaser.Point(
            this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X),
            this.pad.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y)
        );
        if (this.game.input.keyboard.isDown(Phaser.KeyCode.A)) { input.x -= 1; }
        if (this.game.input.keyboard.isDown(Phaser.KeyCode.D)) { input.x += 1; }
        if (this.game.input.keyboard.isDown(Phaser.KeyCode.W)) { input.y -= 1; }
        if (this.game.input.keyboard.isDown(Phaser.KeyCode.S)) { input.y += 1; }
        input.clamp(-1, 1);
        if (input.getMagnitude() > 1) {
            input.normalize();
        }

        var ax = coef * input.x;
        var ay = coef * coefY * input.y;
        var dragx = this.calculateDrag(this.player.body.velocity.x, drag);
        var dragy = this.calculateDrag(this.player.body.velocity.y, drag);
        this.player.body.acceleration.set(ax, ay);
        this.player.body.velocity.add(dragx, dragy);
        this.player.body.velocity.clampX(-maxDX, maxDX);
        this.player.body.velocity.clampY(-maxDY, maxDY);

        if (input.x < -0.5) {
            this.player.animations.play('left');
        }
        else if (input.x < 0.5) {
            this.player.animations.play('main');
        }
        else {
            this.player.animations.play('right');
        }

        if (!this.waveText.visible && this.player.canShoot) {
            var spaceDown = this.game.input.keyboard.isDown(Phaser.KeyCode.J);
            var aDown = this.pad.isDown(Phaser.Gamepad.XBOX360_A);
            if (spaceDown || aDown) {
                this.playerShoot();
            }
        }
    },

    playerShoot: function() {
        var bullet = this.getBulletForPool(
            this.player.bullets,
            this.player.x, this.player.top - 1, 'Green', 2.0
        );
        bullet.body.velocity.set(0, -500);
        this.player.canShoot = false;
        this.setReloadTimer(this.player);
        this.addScore(-1);
        this.sfx.shot3.play();
    },

    getBulletForPool: function(pool, x, y, color, scale) {
        var bullet = pool.getFirstDead(false, x, y);
        if (bullet === null) {
            bullet = this.createBullet(x, y, color, scale);
            pool.add(bullet);
        }
        return bullet;
    },

    // This makes a thingy flicker cause it was hit. It's just an effect.
    setDamaged: function(obj, invulnTime) {
        if (obj.flickerTimer !== null) {
            this.game.time.events.remove(obj.flickerTimer);
            obj.flickerTimer = null;
        }
        obj.flickerTimer = this.game.time.events.add(invulnTime, function() {
            this.flickerTimer = null;
        }, obj);
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

    rand: function(n) {
        return Math.floor(Math.random() * n);
    },

    flickerUpdate: function() {
        this.flickerUpdateOne(this.player);
        if (this.boss !== null) {
            this.flickerUpdateOne(this.boss);
        }
        this.grumpies.forEachAlive(this.flickerUpdateOne, this);
    },

    flickerUpdateOne: function(obj) {
        if (obj.flickerTimer !== null && obj.alpha === 1) {
            obj.alpha = 0.3;
        }
        else {
            obj.alpha = 1;
        }
    },

    /*
    render: function() {
        this.game.debug.body(this.player, 'rgba(255,0,0,0.4)');
        // this.game.debug.text(
        //     '' + this.tracking.moveState,
        //     3, 12,
        //     '#fff'
        // );
    }
    // */
};
