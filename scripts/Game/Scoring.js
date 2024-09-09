// Gathers score from the gameplay and stores the top 5

LunarLander.game.Scoring = (function(storage) {
    "use strict";

    const SCORES_LIMIT = 5;
    let scores = [];

    function initialize() {
        scores = storage.retrieve("scores");
        if (scores === null) { scores = []; }
    }

    function addScore(score) {
        scores.push(score);
        scores.sort((scoreA, scoreB) => {
            let order = (scoreA > scoreB) ? -1 : 1;
            if (scoreA === scoreB) { order = 0; }
            return order;
        });

        scores = (scores.length > SCORES_LIMIT) ? scores.slice(0, SCORES_LIMIT) : scores;
        storage.store(scores, "scores");
    }

    return {
        initialize,
        addScore,
        get scores() { return scores; }
    };
    
}(LunarLander.utilities.StorageUtils));