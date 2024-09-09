// Provides collision detection utility

LunarLander.utilities.CollisionUtils = (function() {
    "use strict";

    function collides(circle, line) {
        const point1 = { x: line.end.x - line.start.x, y: line.end.y - line.start.y };
        const point2 = { x: line.start.x - circle.center.x, y: line.start.y - circle.center.y };
        const b = -2 * ((point1.x * point2.x) + (point1.y * point2.y));
        const c = 2 * ((point1.x * point1.x) + (point1.y * point1.y));
        const intercept = Math.sqrt(b * b - 2 * c * (Math.pow(point2.x, 2) + Math.pow(point2.y, 2) - Math.pow(circle.size.height / 2, 2)));
        
        if (isNaN(intercept)) { return false; }

        const unitDist1 = (b - intercept) / c;
        const unitDist2 = (b + intercept) / c;

        if ((unitDist1 >= 0 && unitDist1 <= 1) || (unitDist2 >= 0 && unitDist2 <= 1)) {
            return true;
        }

        return false;
    }

    return { collides };
}());