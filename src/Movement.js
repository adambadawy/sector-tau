var Movement = {
    grumpy1: function(obj, w, h) {
        var border = 20;
        var speed = 150;
        if (obj.moveState === 0) {
            if (obj.right + border >= w) {
                if (obj.bottom >= h - border) {
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
        if (obj.moveState === 1) {
            if (obj.y >= obj.moveTarget) {
                obj.moveState = 2;
                obj.body.velocity.set(-speed, 0);
            }
            return;
        }
        if (obj.moveState === 2) {
            if (obj.left <= border) {
                if (obj.bottom >= h - border) {
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
        if (obj.moveState === 3) {
            if (obj.y >= obj.moveTarget) {
                obj.moveState = 0;
                obj.body.velocity.set(speed, 0);
            }
            return;
        }
        if (obj.moveState === 4) {
            if (obj.top <= border) {
                obj.moveState = 2;
                obj.body.velocity.set(-speed, 0);
            }
            return;
        }
        if (obj.moveState === 5) {
            if (obj.top <= border) {
                obj.moveState = 0;
                obj.body.velocity.set(speed, 0);
            }
            return;
        }
        if (obj.moveState === -1) {
            obj.moveState = 0;
            obj.body.velocity.set(speed, 0);
            return;
        }
    },

    grumpy2: function(obj, w, h) {
        var border = 20;
        var speed = 150;
        if (obj.moveState === 0) { // Moving down
            if (obj.bottom >= h - border) {
                obj.moveTarget = obj.x + obj.width;
                if (obj.moveTarget > w - border) {
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
                if (obj.moveTarget > w - border) {
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
        if (obj.moveState === -1) {
            obj.moveState = 0;
            obj.body.velocity.set(0, speed);
            return;
        }
    },

    grumpy3: function(obj, w, h) {
        var border = 20;
        var speed = 300;
        if (obj.moveState === 0) { // sweep down+right
            if (obj.bottom >= h - border) {
                obj.moveState = 1;
                obj.body.velocity.set(0, -(speed / 2));
                return;
            }
            var q = obj.y / h;
            obj.body.velocity.set((speed * 1.5) * q, speed / (3 * q));
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
            if (obj.bottom >= h - border) {
                obj.moveState = 3;
                obj.body.velocity.set(0, -(speed / 2));
                return;
            }
            var q = obj.y / h;
            obj.body.velocity.set((speed * -1.5) * q, speed / (3 * q));
            return;
        }
        if (obj.moveState === 3) { // climb up left side
            if (obj.top <= border) {
                obj.moveState = 0;
                obj.body.velocity.set(0, 0);
            }
            return;
        }
        if (obj.moveState === -1) {
            obj.moveState = -2;
            obj.body.velocity.set(0, speed);
            return;
        }
        if (obj.moveState === -2) { // Moving into top-left start pos
            if (obj.top >= border) {
                obj.moveState = 0;
                obj.body.velocity.set(0, 0);
            }
            return;
        }
    }
};
