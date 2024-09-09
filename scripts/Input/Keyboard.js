//Keyboard input handling

LunarLander.input.Keyboard = function() {
    "use strict";

    let state = {
        keys: {},
        handlers: {}
    };

    function keyPress(event) {
        state.keys[event.key] = event.timeStamp;
    }

    function keyRelease(event) {
        delete state.keys[event.key];
    }

    state.update = function(elapsedTime) {
        for (let key in state.keys) {
            if (state.handlers[key]) {
                state.handlers[key](elapsedTime);
            }
        }
    }

    state.registerControl = function(key, handler) {
        state.handlers[key] = handler;
    }

    state.unregisterControl = function(key) {
        delete state.handlers[key];
    }

    state.unregisterControls = function() {
        for (let key in state.handlers) {
            delete state.handlers[key];
        }
        // state.handlers = {};
    }

    state.initialize = function() {
        window.addEventListener("keydown", keyPress);
        window.addEventListener("keyup", keyRelease);
    }

    return state;
};