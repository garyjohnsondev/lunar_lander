//Rendering for the Particle System

LunarLander.rendering.ParticleSystem = (function(core) {
    "use strict";

    function render(system) {
        for (let particle = 0; particle < system.particles.length; particle++) {
            if (system.particles[particle].sprite.ready) {
                core.drawTexture(system.particles[particle]);
            }
        }
    }

    return { render };
}(LunarLander.rendering.core));