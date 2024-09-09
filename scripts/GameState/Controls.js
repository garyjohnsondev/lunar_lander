// Controls menu of the game -- customize control scheme

LunarLander.states.Controls = (function(main, storage) {
    "use strict";

    let controls = {};
    let keys = {
        thrust: document.getElementById("thrustKey"),
        rotateRight: document.getElementById("rotateRightKey"),
        rotateLeft: document.getElementById("rotateLeftKey")
    };

    let captureThrustKey = false;
    let captureRightKey = false;
    let captureLeftKey = false;

    function initialize() {
        controls = storage.retrieve("controls");
        if (controls === null) {
            controls = {
                thrust: 'ArrowUp',
                rotateRight: 'ArrowRight',
                rotateLeft: 'ArrowLeft'
            };
            storage.store(controls, "controls");
        }

        let instruction = document.getElementById("instruction");
        instruction.style.margin = "10px";
        instruction.style.fontSize = "20px";
        instruction.style.color = "#CECEF6";
        instruction.style.textShadow = "2px 2px #000000";

        document.getElementById("thrustControl").addEventListener("click", () => {
            captureThrustKey = true;
            captureRightKey = false;
            captureLeftKey = false;
            instruction.innerHTML = "Press any key to change the Thrust control";
        });
        document.getElementById("rotateRightControl").addEventListener("click", () => {
            captureRightKey = true;
            captureThrustKey = false;
            captureLeftKey = false;
            instruction.innerHTML = "Press any key to change the Rotate Right control";
        });
        document.getElementById("rotateLeftControl").addEventListener("click", () => {
            captureLeftKey = true;
            captureThrustKey = false;
            captureRightKey = false;
            instruction.innerHTML = "Press any key to change the Rotate Left control";
        });
        document.getElementById("controlsBack").addEventListener("click", () => {
            captureThrustKey = false;
            captureRightKey = false;
            captureLeftKey = false;
            instruction.innerHTML = "";

            storage.store(controls, "controls");

            main.setState("MainMenu");
        });
        
        window.addEventListener("keydown", (event) => {
            if (captureThrustKey && (controls.rotateRight !== event.key) && (controls.rotateLeft !== event.key)) {
                controls.thrust = event.key;
                captureThrustKey = false;
                instruction.innerHTML = "";
            } else if (captureRightKey && (controls.thrust !== event.key) && (controls.rotateLeft !== event.key)) {
                controls.rotateRight = event.key;
                captureRightKey = false;
                instruction.innerHTML = "";
            } else if (captureLeftKey && (controls.thrust !== event.key) && (controls.rotateRight !== event.key)) {
                controls.rotateLeft = event.key;
                captureLeftKey = false;
                instruction.innerHTML = "";
            }
            displayControls();
        });
    }

    function displayControls() {
        for (let property in controls) {
            keys[property].innerHTML = controls[property];
        }
    }

    function run() {
        displayControls();
    }    

    return {
        initialize,
        run
    };

}(LunarLander.main, LunarLander.utilities.StorageUtils));