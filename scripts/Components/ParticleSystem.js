// Manager for the particle system within the game

LunarLander.components.ParticleSystem = (function(particle, random) {
    "use strict";

    let state = {
        particles: [],
    };

    state.update = function (elapsedTime) {
        let liveParticles = [];
        for (let p = 0; p < state.particles.length; p++) {
            if (state.particles[p].update(elapsedTime)) {
                liveParticles.push(state.particles[p]);
            }
        }

        state.particles = liveParticles;
    }

    state.landerCrash = function(center, randomSpec) {
        for (let p = 0; p < 200; p++) {
            state.particles.push(particle({
                sourceImage: (p % 2 == 0) ? "assets/images/fire.png" : "assets/images/smoke.png",
                lifespan: random.gaussian(randomSpec.lifeMean, randomSpec.lifeStdDev),
                center: { x: center.x, y: center.y },
                size: Math.abs(random.gaussian(randomSpec.sizeMean, randomSpec.sizeStdDev)),
                rotation: 0.0,
                rotationRate: (2 * Math.PI) / 1000,
                velocity: random.gaussian(randomSpec.velocityMean, randomSpec.velocityStdDev),
                direction: random.circleVector()
            }));
        }
    }

    state.landerThrust = function(center, angle, randomSpec) {
        for (let p = 0; p < 12; p++) {
            state.particles.push(particle({
                sourceImage: (p % 2 == 0) ? "assets/images/fire.png" : "assets/images/smoke.png",
                lifespan: random.gaussian(randomSpec.lifeMean, randomSpec.lifeStdDev),
                center: { x: center.x, y: center.y },
                size: Math.abs(random.gaussian(randomSpec.sizeMean, randomSpec.sizeStdDev)),
                rotation: 0.0,
                rotationRate: (2 * Math.PI) / 1000,
                velocity: random.gaussian(randomSpec.velocityMean, randomSpec.velocityStdDev),
                direction: {
                    x: random.gaussian(Math.cos(angle + Math.PI / 2), 0.3),
                    y: random.gaussian(Math.sin(angle + Math.PI / 2), 0.3)
                }
            }));
        }
    }

    return state;
    
}(LunarLander.components.Particle, LunarLander.utilities.RandomUtils));