// Creates and manages the lunar terrain

LunarLander.components.Terrain = (function(random) {
    "use strict";

    let state = {
        points: [],
        width: 4,
        fillColor: 'rgba(100, 100, 100, 1.0)',
        strokeColor: "rgba(50, 50, 50, 0.75)",
        safeZoneColor: "rgba(0, 255, 0, 0.75)"
    };

    function computeElevation(pointA, pointB, roughnessFactor) {
        let roughness = (roughnessFactor * random.gaussian(0, 1) * Math.abs(pointB.x - pointA.x));
        let elevation = (pointA.y + pointB.y) / 2 + roughness;
        let midpoint = (pointA.x + pointB.x) / 2;

        if (elevation < 0.25) {  
            elevation = random.range(0.25, 0.33);
        }

        if (elevation > 1.0) { 
            elevation = random.range(0.75, 0.85)
        }

        return { x: midpoint, y: elevation, safeZone: false};
    }

    function makeSafeZone(xRange, yRange, lengthRange) {
        let start = {
            x: random.range(xRange.min, xRange.max),
            y: random.range(yRange.min, yRange.max),
            safeZone: true
        };
        let end = {
            x: start.x + random.range(lengthRange.min, lengthRange.max),
            y: start.y,
            safeZone: false
        };

        return { start, end };
    }

    state.generate = function(safeZones) {
        const padding =  0.15;

        state.points = [];

        // terrain starts with only start and end points
        state.points.push(
            { x: 0.0, y: random.range(padding, 1.0 - padding), safeZone: false },
            { x: 1.0, y: random.range(padding, 1.0 - padding), safeZone: false }
        );

        let nextIndex = 1;   // point for next terrain coord to be inserted
        for (let zone = 0; zone < safeZones; zone++) {
            const xRange = { min: (zone / safeZones) + padding, max: (1.0 / (safeZones - zone)) - padding };
            const yRange = { min: 0.5, max: 1.0 - padding };
            const lengthRange = {
                min: (safeZones > 1) ? 0.083 : 0.067,
                max: (safeZones > 1) ? 0.117 : 0.1
            };
            let safeZone = makeSafeZone(xRange, yRange, lengthRange);
            state.points.splice(nextIndex, 0, safeZone.start);
            state.points.splice(nextIndex + 1, 0, safeZone.end);
            nextIndex += 2;
        }

        // midpoint displacement
        for (let iteration = 0; iteration < 8; iteration++) {
            let midpoints = [];
            for (let point = 0; point < state.points.length; point++) {
                if (!state.points[point].safeZone && (point + 1) < state.points.length) {
                    midpoints.push({
                        point: computeElevation(state.points[point], state.points[point + 1], 1),
                        index: point + 1
                    }); 
                }
            }
            for (let midpoint = midpoints.length - 1; midpoint >= 0; midpoint--) {
                state.points.splice(midpoints[midpoint].index, 0, midpoints[midpoint].point);
            }
        }
        
        // add final border points to enable color filling
        state.points.push(
            { x: 1.0, y: 1.0, safeZone: false },
            { x: 0, y: 1.0, safeZone: false }
        );
    }

    return state;
    
}(LunarLander.utilities.RandomUtils));