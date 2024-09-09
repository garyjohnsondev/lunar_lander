// Gameplay state -- all gameplay functionality is located here

LunarLander.states.GamePlay = (function(main, model, core, input, storage) {
    "use strict";

    let state = {
        gameModel: model,
        keyboard: input.Keyboard(),
        controls: {},
        previousTime: 0,
        gameRunning: false,
        menus: {
            pause: document.getElementById("pause"),
            gameOver: document.getElementById("gameOver")
        }
    };

    function processInput(elapsedTime) {
        state.keyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        if (state.gameModel.update(elapsedTime, (state.controls.thrust in state.keyboard.keys))) {  // game over
            state.gameRunning = false;
            state.menus.gameOver.style.display = "block";
        }
    }

    function render() {
        core.clear();
        state.gameModel.render();
    }

    function gameLoop(timeStamp) {
        const elapsedTime = timeStamp - state.previousTime;
        state.previousTime = timeStamp;

        processInput(elapsedTime);
        update(elapsedTime);
        render();

        if (state.gameRunning) {
            requestAnimationFrame(gameLoop);
        }
    }
    
    function initialize() {  // set up necessary variables
        core.initialize();
        state.gameModel.initialize();
        state.keyboard.initialize();

        document.getElementById("continueButton").addEventListener("click",
            () => {
                state.menus.pause.style.display = "none";
                state.gameRunning = true;
                state.previousTime = performance.now();
                requestAnimationFrame(gameLoop);
            }
        );
        document.getElementById("retryButton").addEventListener("click", 
            () => {
                state.menus.gameOver.style.display = "none";
                state.gameModel.initialize();
                run();
            }
        );
        let quitButtons = document.getElementsByClassName("quit-button");
        for (let button = 0; button < quitButtons.length; button++) {
            quitButtons[button].addEventListener("click", 
                () => {
                    state.menus.pause.style.display = "none";
                    state.menus.gameOver.style.display = "none";
                    state.gameModel.initialize();
                    main.setState("MainMenu");
                }
            )
        }
    }

    function run() {  // start gameloop
        state.keyboard.unregisterControls();
        state.controls = storage.retrieve("controls");

        state.keyboard.registerControl("Escape", () => { // pause
            state.gameRunning = false;
            state.menus.pause.style.display = "block";
        });
        state.keyboard.registerControl(state.controls.thrust, state.gameModel.landerThrust);
        state.keyboard.registerControl(state.controls.rotateRight, state.gameModel.rotateLanderRight);
        state.keyboard.registerControl(state.controls.rotateLeft, state.gameModel.rotateLanderLeft);

        state.gameModel.play();
        state.gameRunning = true;
        state.previousTime = performance.now();
        requestAnimationFrame(gameLoop);
    } 

    return {
        initialize,
        run
    };
}(LunarLander.main, 
  LunarLander.game.Model, 
  LunarLander.rendering.core, 
  LunarLander.input, 
  LunarLander.utilities.StorageUtils));