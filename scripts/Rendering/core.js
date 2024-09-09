// General rendering api

LunarLander.rendering.core = (function() {
    "use strict";

    let canvas = null;
    let context = null;
    let gameDims = {
        size: 0,
        minY: 0,
        minX: 0
    };

    function resize() {
        if (window.innerWidth < window.innerHeight) {
            gameDims.size = window.innerWidth;
            gameDims.minY = (window.innerHeight - gameDims.size) / 2;
            gameDims.minX = Math.floor(window.innerWidth * 0.05);
        } else {
            gameDims.size = window.innerHeight;
            gameDims.minY = Math.floor(window.innerHeight * 0.05);
            gameDims.minX = (window.innerWidth - gameDims.size) / 2;
        }
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initialize() {
        canvas = document.getElementById("gameCanvas");
        context = canvas.getContext("2d");

        resize();

        window.addEventListener("resize", () => {
            resize();
        });
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawTerrain(terrain) {
        context.save();

        context.lineWidth = terrain.width;
        context.strokeStyle = terrain.strokeColor;
        context.fillStyle = terrain.fillColor;

        let safeZones = [];

        context.beginPath();
        let scaledPoint = {
            x: terrain.points[0].x * gameDims.size + gameDims.minX,
            y: terrain.points[0].y * gameDims.size + gameDims.minY
        };
        context.moveTo(scaledPoint.x, scaledPoint.y);
        for (let point = 1; point < terrain.points.length; point++) {
            if (terrain.points[point].safeZone) {
                safeZones.push(point);
            }
            scaledPoint.x = terrain.points[point].x * gameDims.size + gameDims.minX;
            scaledPoint.y = terrain.points[point].y * gameDims.size + gameDims.minY;
            context.lineTo(scaledPoint.x, scaledPoint.y);
        }
        context.closePath();
        
        context.stroke();
        context.fill();

        // start new path for the landing zone segments' color
        context.beginPath();
        for (let safeZone = 0; safeZone < safeZones.length; safeZone++) {
            scaledPoint.x = terrain.points[safeZones[safeZone]].x * gameDims.size + gameDims.minX;
            scaledPoint.y = terrain.points[safeZones[safeZone]].y * gameDims.size + gameDims.minY;
            context.moveTo(scaledPoint.x, scaledPoint.y);
            scaledPoint.x = terrain.points[safeZones[safeZone] + 1].x * gameDims.size + gameDims.minX;
            scaledPoint.y = terrain.points[safeZones[safeZone] + 1].y * gameDims.size + gameDims.minY;
            context.lineTo(scaledPoint.x, scaledPoint.y);
        }
        context.strokeStyle = terrain.safeZoneColor;
        context.closePath();
        context.stroke();

        context.restore();
    }

    function drawTexture(props) {
        context.save();

        let scaledCenter = { 
            x: props.center.x * gameDims.size + gameDims.minX,
            y: props.center.y * gameDims.size + gameDims.minY 
        };
        let scaledSize = { 
            width: props.size.width * gameDims.size, 
            height: props.size.height * gameDims.size 
        };

        context.translate(scaledCenter.x, scaledCenter.y);
        context.rotate(props.rotation);
        context.translate(-scaledCenter.x, -scaledCenter.y);
        
        context.drawImage(
            props.sprite,
            scaledCenter.x - (scaledSize.width / 2),
            scaledCenter.y - (scaledSize.height / 2),
            scaledSize.width, scaledSize.height);

        context.restore();
    }

    function drawText(props) {
        context.save();

        context.font = props.font;
        context.fillStyle = props.fill;
        context.textBaseLine = "top";
        context.textAlign = props.alignment;

        context.fillText(
            props.text,
            gameDims.minX + (props.position.x * gameDims.size),
            gameDims.minY + (props.position.y * gameDims.size)
        );

        context.restore();
    }

    function getTextHeight(props) {
        let height = 0;
        context.save();

        context.font = props.font;
        context.fillStyle = props.fill;

        height = context.measureText('m').width / gameDims.size;

        context.restore();
        return height;
    }

    function getTextWidth(props) {
        let width = 0;
        context.save();

        context.font = props.font;
        context.fillStyle = props.fill;

        width = context.measureText(props.text).width / gameDims.size;

        context.restore();
        return width;
    }

    return {
        initialize,
        resize,
        clear,
        getTextHeight,
        getTextWidth,

        drawTerrain,
        drawText,
        drawTexture,
    };
    
}());