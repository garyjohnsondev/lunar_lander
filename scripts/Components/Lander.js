//The physical lander object in the game

LunarLander.components.Lander = (() => {
    "use strict";

    let gravity = 0;

    let state = {
        sprite: new Image(),
        center: { x: 0.0, y: 0.0 },
        size: { width: 0.1, height: 0 },
        thruster: { x: 0.0, y: 0.0 },
        thrustRate: 0.000003,
        rotation: 0.0,
        rotationRate: 0.05,
        momentum: { x: 0.0, y: 0.0 },
        mass: 0.01,
        active: false,
        status: {
            fuel: 0.0,
            angle: 0.0,
            velocity: 0.0
        },
    };

    let lander = {
        get sprite() { return state.sprite; },
        get status() { return state.status; },
        get center() { return state.center; },
        get rotation() { return state.rotation; },
        get thruster() { return state.thruster; },
        get active() { return state.active; },
        get size() { return { width: state.size.width, height: state.size.height }; }
    };

    lander.initialize = function(g) {
        gravity = g;
        state.sprite.src = "assets/images/lander.png";
        state.sprite.onload = () => {
            state.sprite.ready = true;
            state.size.height = state.size.width * (state.sprite.naturalHeight / state.sprite.naturalWidth);
        }
    }

    lander.orient = function(center, rotation) {
        state.center.x = center.x;  
        state.center.y = center.y;
        state.rotation = rotation;
        state.momentum.x = 0.0;
        state.momentum.y = 0.0; 
        state.status.fuel = 10.0;
        state.active = true;
        state.sprite.ready = true;
    }

    lander.update = function(elapsedTime, conditions) {
        if (!conditions.landed && !conditions.crashed) {
            state.momentum.y += (gravity * elapsedTime);

            state.center.x += (state.momentum.x * elapsedTime);
            state.center.y += (state.momentum.y * elapsedTime);

            const thrusterOffset = state.size.height / 4;
            state.thruster.x = state.center.x - Math.sin(state.rotation) * thrusterOffset;
            state.thruster.y = state.center.y + Math.cos(state.rotation) * thrusterOffset;   
        
            state.status.angle = state.rotation * (180 / Math.PI);
            state.status.velocity = Math.abs((state.momentum.y / state.mass) * 1000);
        } else if (conditions.landed) {
            state.active = false;
        } else if (conditions.crashed) {
            state.active = false;
            state.sprite.ready = false;
        }
    }

    lander.thrust = function(elapsedTime) {
        if (state.active && state.status.fuel >= 0.0) {
            const thrustX = Math.sin(state.rotation);
            const thrustY = Math.cos(state.rotation);

            state.momentum.x += (thrustX * state.thrustRate * state.mass * elapsedTime);
            state.momentum.y -= (thrustY * state.thrustRate * state.mass * elapsedTime);

            const fuelCost = 15;
            state.status.fuel -= ((state.mass * fuelCost) / elapsedTime);
        }
    }

    lander.rotateLeft = function(elapsedTime) {
        if (state.active) {
            state.rotation -= (state.rotationRate * state.mass * elapsedTime);
            if (state.rotation <= 0) {
                state.rotation = (2 * Math.PI);
            }
        }
    }

    lander.rotateRight = function(elapsedTime) {
        if (state.active) {
            state.rotation += (state.rotationRate * state.mass * elapsedTime);
            if (state.rotation >= (2 * Math.PI)) {
                state.rotation = 0;
            }
        }
    }

    return lander;
});