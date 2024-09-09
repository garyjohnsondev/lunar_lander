// Main entry point for the game -- initializes all states and defaults to the Main Menu.

LunarLander.main = (function(states) {
    "use strict";

    // Sets the game state to the state matching 'stateID'
    function setState(stateID) {
        let activeStates = document.getElementsByClassName("active");
        for (let state = 0; state < activeStates.length; state++) {
            activeStates[state].classList.remove("active");
        }

        document.getElementById(stateID).classList.add("active");
        states[stateID].run();
    }

    // Initializes every game state
    function initialize() {
        // let state = null;
        console.log("MAIN");

        for (let state in states) {
            // if (states.hasOwnProperty(state)) {}
            states[state].initialize();
        }

        // Defaults the state to the Main Menu
        setState("MainMenu");
    }

    return {
        setState,
        initialize
    };
}(LunarLander.states));