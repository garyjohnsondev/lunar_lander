//Manager for the whole game

LunarLander.game.Model = (function(components, rendering, collision, scoring) {
    "use strict";

    const FINAL_LEVEL = 2;
    const GRAVITY = 0.00000001;

    let state = {
        level: 0,
        landingZones: 0,
        score: 0.0,
        countdowns: {
            gameOver: 0,
            transition: 0
        },
        gameOverMessage: "",
        terrain: components.Terrain,
        lander: components.Lander,
        particleSystem: components.ParticleSystem,
        audio: {
            thrust: new Audio("assets/sounds/thrust.mp3"),
            explosion: new Audio("assets/sounds/explosion.mp3"),
            success: new Audio("assets/sounds/success.mp3")
        },
    };

    state.initialize = function() {
        state.level = 0;
        state.landingZones = 2;
        state.score = 0.0;
        state.landerCrashed = false;
        state.landerLanded = false;

        state.lander.initialize(GRAVITY);
        
        state.audio.thrust.loop = true;
        state.audio.explosion.volume = 0.5;
        state.audio.success.volume = 0.3;
    }

    state.play = function() {
        state.level++; 
        state.countdowns.transition = 3000;
        state.countdowns.gameOver = 2000;
        state.audio.thrust.volume = 0.3;

        state.lander.orient({ x: 0.5, y: 0.1 }, (3 * Math.PI) / 2);
        state.terrain.generate(state.landingZones);
    }

    state.update = function(elapsedTime, thrusting) {
        state.lander.update(elapsedTime, { landed: state.landerLanded, crashed: state.landerCrashed });
        state.particleSystem.update(elapsedTime);
        if (!thrusting) {
            state.audio.thrust.pause();
            if (state.audio.thrust.paused) { state.audio.thrust.load(); }
        }

        let gameOver = false;
        if (state.landerLanded) {
            if (state.level < FINAL_LEVEL) {
                state.countdowns.transition -= elapsedTime;
                if (state.countdowns.transition <= 0.0) {
                    state.score += (state.lander.status.fuel * state.level);
                    state.landerLanded = false;
                    state.landingZones = 1;
                    state.play(); 
                }
            } else {
                state.countdowns.gameOver -= elapsedTime;
                if (state.countdowns.gameOver <= 0.0) {
                    state.score += (state.lander.status.fuel * state.level);
                    scoring.addScore(state.score.toFixed(2));
                    gameOver = true;
                }
            }
        } else if (state.landerCrashed) {
            state.countdowns.gameOver -= elapsedTime;
            if (state.countdowns.gameOver <= 0.0) {
                state.landerCrashed = false;
                gameOver = true;
            }
        } else {  // no collision
            for (let point = 0; point < state.terrain.points.length - 1; point++) {
                if (collision.collides(state.lander, { start: state.terrain.points[point], end: state.terrain.points[point + 1] })) {
                    state.audio.thrust.volume = 0.0;
                    if (state.terrain.points[point].safeZone && safeToLand()) {
                        state.landerLanded = true;
                        state.gameOverMessage = "Mission Success";
                        state.audio.success.play();
                        break;
                    } else {
                        state.landerCrashed = true;
                        state.gameOverMessage = "Mission Failure";
                        state.audio.explosion.play();
                        state.particleSystem.landerCrash(state.lander.center, 
                            {
                                sizeMean: 0.01, sizeStdDev: 0.002,
                                velocityMean: 0.00005, velocityStdDev: 0.000005,
                                lifeMean: 1500, lifeStdDev: 100
                            });
                        break;
                    }
                }
            }
        }
        return gameOver;
    }

    state.render = function() {
        rendering.Terrain.render(state.terrain);
        rendering.Lander.render(state.lander);
        rendering.ParticleSystem.render(state.particleSystem);
        rendering.Status.render(state.lander.status);

        if (state.landerLanded || state.landerCrashed) {
            rendering.core.drawText({
                text: state.gameOverMessage,
                font: "32px Impact, sans-serif",
                fill: "rgba(255, 255, 255, 0.75)",
                alignment: "center",
                position: { x: 0.5, y: 0.15 }
            });
        }

        if (state.landerLanded && state.level < FINAL_LEVEL) {
            rendering.core.drawText({
                text: `Next level begins in... ${Math.floor(state.countdowns.transition / 1000)}`,
                font: "24px Impact, sans-serif",
                fill: "rgba(255, 255, 255, 0.75)",
                alignment: "left",
                position: { x: 0.7, y: 0.05 }
            });
        }
    }
    
    state.landerThrust = function(elapsedTime) {
        if (!state.landerCrashed && !state.landerLanded) {
            state.lander.thrust(elapsedTime);
            state.audio.thrust.play();
            if (state.countdowns.transition < 3000 || state.countdowns.gameOver < 2000) {
                state.audio.thrust.pause();
            }
            state.particleSystem.landerThrust(state.lander.thruster, state.lander.rotation, 
                {
                    sizeMean: 0.0083, sizeStdDev: 0.00167,
                    velocityMean: 0.0001, velocityStdDev: 0.00001,
                    lifeMean: 300.0, lifeStdDev: 100.0
                });
        }
    }

    state.rotateLanderRight = function(elapsedTime) {
        state.lander.rotateRight(elapsedTime);
    }

    state.rotateLanderLeft = function(elapsedTime) {
        state.lander.rotateLeft(elapsedTime);
    }

    function safeToLand() {
        let status = state.lander.status;
        return (status.fuel > 0.0 && !(status.angle > 5.0 && status.angle < 355.0) && status.velocity < 2.00);
    }

    return state;
}(LunarLander.components, 
  LunarLander.rendering, 
  LunarLander.utilities.CollisionUtils, 
  LunarLander.game.Scoring));