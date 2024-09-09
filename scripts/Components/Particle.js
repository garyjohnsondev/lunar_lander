// Code for a single Particle component

LunarLander.components.Particle = function(props) {
    "use strict";

    let state = {
        sprite: new Image(),
        center: { x: props.center.x, y: props.center.y },
        size: { width: props.size, height: props.size },
        rotation: 0.0,
        rotationRate: props.rotationRate,
        velocity: props.velocity,
        direction: props.direction,
        age: 0,
        lifespan: props.lifespan
    };

    state.sprite.src = props.sourceImage;
    state.sprite.ready = false;
    state.sprite.onload = () => state.sprite.ready = true;

    function update(elapsedTime) {
        state.age += elapsedTime;

        state.center.x += (elapsedTime * state.velocity * state.direction.x);
        state.center.y += (elapsedTime * state.velocity * state.direction.y);

        state.rotation += (state.rotationRate * elapsedTime);
        state.rotation %= (2 * Math.PI);

        return (state.age <= state.lifespan);
    }

    return {
        update,
        get center() { return state.center; },
        get size() { return state.size; },
        get rotation() { return state.rotation; },
        get sprite() { return state.sprite; }
    };
}