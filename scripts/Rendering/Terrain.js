// Terrain rendering

LunarLander.rendering.Terrain = (function(core) {
    "use strict";

    function render(terrain) {
        core.drawTerrain(terrain);
    }

    return { render };
    
}(LunarLander.rendering.core));