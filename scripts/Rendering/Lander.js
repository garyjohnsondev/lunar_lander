// Lander rendering

LunarLander.rendering.Lander = (function(core) {
    "use strict";

    function render(props) {
        if (props.sprite.ready) {
            core.drawTexture(props)
        }
    }

    return { render };

}(LunarLander.rendering.core));