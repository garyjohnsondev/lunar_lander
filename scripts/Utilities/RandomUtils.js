// Provides random number generation utilities. Minorly adapted from code provided by Dr. Dean Mathias

LunarLander.utilities.RandomUtils = (function() {
    "use strict";

    function double() {
        return Math.random();
    }

    function range(min, max) {
        let range = max - min;
        return (Math.random() * range) + min;
    }

    function circleVector() {
        let angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    let usePrevious = false;
    let y2;

    function gaussian(mean, stdDev) {
        let x1 = 0;
        let x2 = 0;
        let y = 0;
        let z = 0;

        if (usePrevious) {
            usePrevious = false;
            return mean + y2 * stdDev;
        }

        usePrevious = true;

        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            z = (x1 * x1) + (x2 * x2);
        } while (z >= 1);
        
        z = Math.sqrt((-2 * Math.log(z)) / z);
        y = x1 * z;
        y2 = x2 * z;
        
        return mean + y * stdDev;
    }

    return {
        double,
        range,
        circleVector,
        gaussian
    };

}());