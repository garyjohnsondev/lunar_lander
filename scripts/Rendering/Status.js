// Rendering for the lander status on screen

LunarLander.rendering.Status = (function(core) {
    "use strict";

    let props = {
            position: { x: 0.8, y: 0.1 },
            alignment: "left",
            font: "12px Arial, sans-serif",
            colors: {
                good: "rgba(0, 255, 0, 1.0)",
                bad: "rgba(255, 0, 0, 1.0)"
            },
        };

    function render(status) {
        const textHeight = core.getTextHeight({ font: props.font, fill: props.colors.good });

        core.drawText({
            text: `Fuel: ${status.fuel.toFixed(2)} liters`,
            font: props.font,
            fill: (status.fuel > 0.0) ? props.colors.good : props.colors.bad,
            alignment: props.alignment,
            position: { x: props.position.x, y: props.position.y }
        });
        core.drawText({
            text: `Angle: ${status.angle.toFixed(2)} \xB0`,
            font: props.font,
            fill: (status.angle > 5.0 && status.angle < 355) ? props.colors.bad : props.colors.good,
            alignment: props.alignment,
            position: { x: props.position.x, y: props.position.y + (textHeight * 1.5) }
        });
        core.drawText({
            text: `Velocity: ${status.velocity.toFixed(2)} m/s`,
            font: props.font,
            fill: (status.velocity < 2.0) ? props.colors.good : props.colors.bad,
            alignment: props.alignment,
            position: { x: props.position.x, y: props.position.y + (2 * textHeight * 1.5) }
        });
    }

    return { render };
}(LunarLander.rendering.core));