// High Scores state -- displays top 5 highest scores

LunarLander.states.Scores = (function(main, scoring) {
    "use strict";

    function initialize() {
        scoring.initialize();
        document.getElementById("scoresBack").addEventListener("click", () => {
            main.setState("MainMenu");
        });
    } 

    function run() {
        let scores = document.getElementById("scoresList");
        scores.innerHTML = "";

        scoring.scores.forEach((score) => {
            let listItem = document.createElement("li");
            listItem.innerHTML = score;
            scores.appendChild(listItem);
        });
    }

    return {
        initialize,
        run
    };
}(LunarLander.main, LunarLander.game.Scoring));