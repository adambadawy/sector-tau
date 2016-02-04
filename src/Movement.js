var Movement = {
    bakeGrumpy1: function(w, h) {
        var border = 20;
        var speed = 150;
        var rightBorderX = w - border;
        var bottomBorderY = h - border;
        return function(obj) {
            if (obj.moveState === 0) { // move to right edge
                if (obj.right >= rightBorderX) {
                    if (obj.bottom >= bottomBorderY) {
                        obj.moveState = 4;
                        obj.body.velocity.set(0, -speed);
                        return;
                    }
                    obj.moveState = 1;
                    obj.moveTarget = obj.y + obj.height;
                    obj.body.velocity.set(0, speed);
                }
                return;
            }
            if (obj.moveState === 1) { // move down a row on right edge
                if (obj.y >= obj.moveTarget) {
                    obj.moveState = 2;
                    obj.body.velocity.set(-speed, 0);
                }
                return;
            }
            if (obj.moveState === 2) { // move to left edge
                if (obj.left <= border) {
                    if (obj.bottom >= bottomBorderY) {
                        obj.moveState = 5;
                        obj.body.velocity.set(0, -speed);
                        return;
                    }
                    obj.moveState = 3;
                    obj.moveTarget = obj.y + obj.height;
                    obj.body.velocity.set(0, speed);
                }
                return;
            }
            if (obj.moveState === 3) { // move down a row on left edge
                if (obj.y >= obj.moveTarget) {
                    obj.moveState = 0;
                    obj.body.velocity.set(speed, 0);
                }
                return;
            }
            if (obj.moveState === 4) { // climb back up right edge
                if (obj.top <= border) {
                    obj.moveState = 2;
                    obj.body.velocity.set(-speed, 0);
                }
                return;
            }
            if (obj.moveState === 5) { // climb back up left edge
                if (obj.top <= border) {
                    obj.moveState = 0;
                    obj.body.velocity.set(speed, 0);
                }
                return;
            }
            if (obj.moveState === -1) { // start offscreen left
                obj.moveState = 0;
                obj.body.velocity.set(speed, 0);
                return;
            }
        };
    },

    bakeGrumpy2: function(w, h) {
        var border = 20;
        var speed = 150;
        var rightBorderX = w - border;
        var bottomBorderY = h - border;
        return function(obj) {
            if (obj.moveState === 0) { // Moving down
                if (obj.bottom >= bottomBorderY) {
                    obj.moveTarget = obj.x + obj.width;
                    if (obj.moveTarget > rightBorderX) {
                        obj.moveState = 4;
                        obj.body.velocity.set(-speed, 0);
                        return;
                    }
                    obj.moveState = 1;
                    obj.body.velocity.set(speed, 0);
                }
                return;
            }
            if (obj.moveState === 1) { // Moving right at bottom
                if (obj.x >= obj.moveTarget) {
                    obj.moveState = 2;
                    obj.body.velocity.set(0, -speed);
                }
                return;
            }
            if (obj.moveState === 2) { // Moving up
                if (obj.top <= border) {
                    obj.moveTarget = obj.x + obj.width;
                    if (obj.moveTarget > rightBorderX) {
                        obj.moveState = 5;
                        obj.body.velocity.set(-speed, 0);
                        return;
                    }
                    obj.moveState = 3;
                    obj.body.velocity.set(speed, 0);
                }
                return;
            }
            if (obj.moveState === 3) { // Moving right at top
                if (obj.x >= obj.moveTarget) {
                    obj.moveState = 0;
                    obj.body.velocity.set(0, speed);
                }
                return;
            }
            if (obj.moveState === 4) { // Reset (move left) at bottom
                if (obj.left <= border) {
                    obj.moveState = 2;
                    obj.body.velocity.set(0, -speed);
                }
                return;
            }
            if (obj.moveState === 5) { // Reset (move left) at top
                if (obj.left <= border) {
                    obj.moveState = 0;
                    obj.body.velocity.set(0, speed);
                }
                return;
            }
            if (obj.moveState === -1) { // start above screen
                obj.moveState = 0;
                obj.body.velocity.set(0, speed);
                return;
            }
        };
    },

    bakeGrumpy3: function(w, h) {
        var border = 20;
        var bottomBorderY = h - border;
        var speed = 300;
        var speedX = speed * 1.5;
        var speedY = speed / 3;
        var climbSpeed = -(speed / 2);
        return function(obj) {
            if (obj.moveState === 0) { // sweep down+right
                if (obj.bottom >= bottomBorderY) {
                    obj.moveState = 1;
                    obj.body.velocity.set(0, climbSpeed);
                    return;
                }
                var q = obj.y / h;
                obj.body.velocity.set(speedX * q, speedY / q);
                return;
            }
            if (obj.moveState === 1) { // climb up right side
                if (obj.top <= border) {
                    obj.moveState = 2;
                    obj.body.velocity.set(0, 0);
                }
                return;
            }
            if (obj.moveState === 2) { // sweep down+left
                if (obj.bottom >= bottomBorderY) {
                    obj.moveState = 3;
                    obj.body.velocity.set(0, climbSpeed);
                    return;
                }
                var q = obj.y / h;
                obj.body.velocity.set(-(speedX * q), speedY / q);
                return;
            }
            if (obj.moveState === 3) { // climb up left side
                if (obj.top <= border) {
                    obj.moveState = 0;
                    obj.body.velocity.set(0, 0);
                }
                return;
            }
            if (obj.moveState === -1) { // start above screen
                obj.moveState = -2;
                obj.body.velocity.set(0, speed);
                return;
            }
            if (obj.moveState === -2) { // move to start pos from above screen
                if (obj.top >= border) {
                    obj.moveState = 0;
                    obj.body.velocity.set(0, 0);
                }
                return;
            }
        };
    },

    bakeBoss1: function(w, h) {
        var border = 20;
        var rightBorderX = w - border;
        var ySpeed = 40;
        var xSpeed = 100;
        var bottomY = border + 200;
        // var rightBorderX = w - border;
        // var bottomBorderY = h - border;
        return function(obj) {
            if (obj.moveState >= 0) {
                if (obj.top <= border) {
                    obj.body.velocity.y = ySpeed;
                }
                if (obj.bottom >= bottomY) {
                    obj.body.velocity.y = -ySpeed;
                }
                if (obj.moveState === 0) {
                    if (obj.right >= rightBorderX) {
                        obj.moveState = 1;
                        obj.body.velocity.x = -xSpeed;
                    }
                    return;
                }
                if (obj.moveState === 1) {
                    if (obj.left <= border) {
                        obj.moveState = 0;
                        obj.body.velocity.x = xSpeed;
                    }
                    return;
                }
            }
            if (obj.moveState === -1) { // start centered, above screen
                obj.moveState = -2;
                obj.body.velocity.set(0, ySpeed);
                return;
            }
            if (obj.moveState === -2) { // move down into start pos
                if (obj.top >= border) {
                    obj.moveState = 0;
                    obj.body.velocity.x = xSpeed;
                }
                return;
            }
        };
    }
};
