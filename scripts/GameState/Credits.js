// Credits menu of the game -- basically just my name

LunarLander.states.Credits = (function(main) {
    "use strict";

    function initialize() {
        document.getElementById("creditsBack").addEventListener(
            "click",
            () => {
                main.setState("MainMenu");
            }
        );
    }

    function run() {
        console.log("Showing credits");
    }

    return {
        initialize,
        run
    };
}(LunarLander.main));