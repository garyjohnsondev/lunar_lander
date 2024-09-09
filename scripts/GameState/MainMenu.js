// Main Menu of the game -- access to all other states of the game

LunarLander.states.MainMenu = (function(main) {
    "use strict";
    
    function initialize() {
        document.getElementById("newGameButton").addEventListener("click", () => {
            main.setState("GamePlay");
        });

        document.getElementById("controlsButton").addEventListener("click", () => {
            main.setState("Controls");
        });

        document.getElementById("scoresButton").addEventListener("click", () => {
            main.setState("Scores");
        });

        document.getElementById("creditsButton").addEventListener("click", () => {
            main.setState("Credits");
        });
    }

    function run() {
        //nothing to run here. just preserving consistency
        console.log("At Main Menu");
    }

    return {
        initialize,
        run
    };
}(LunarLander.main));