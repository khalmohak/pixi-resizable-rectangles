import React from 'react'
import {Graphics, Sprite} from "@inlet/react-pixi";
import * as PIXI from "pixi.js";


const drawPolygon = (g, points) => {
    g.clear()
    g.beginFill(0x3366cc, 0.3); // Light blue color with transparency
    // g.lineStyle(2, 0x3366cc); // Solid blue border
    g.drawPolygon(points);
    g.endFill();
};

const drawPoint = (index, point, points_, setPoints) => {
    if (index % 2 === 0) {
        return (
            <Sprite
                key={index}
                texture={PIXI.Texture.WHITE}
                // Purple
                tint={0x3366cc} // Blue color for the points
                anchor={0.5}
                zIndex={2}
                interactive
                buttonMode={true}
                x={point}
                y={points_[index + 1]}
                width={8} // Slightly larger size
                height={8}
                // ... pointer events handlers ...
                pointerdown={(event) => {
                    const sprite = event.currentTarget;
                    sprite.alpha = 0.5;
                    sprite.data = event.data;
                    sprite.dragging = true;
                }}
                pointerup={(event) => {
                    const sprite = event.currentTarget;
                    sprite.alpha = 1;
                    sprite.dragging = false;
                    sprite.data = null;
                }}
                pointerupoutside={(event) => {
                    const sprite = event.currentTarget;
                    sprite.alpha = 1;
                    sprite.dragging = false;
                    sprite.data = null;
                }}
                pointermove={(event) => {
                    const sprite = event.currentTarget;
                    if (sprite.dragging) {
                        const newPosition = sprite.data?.getLocalPosition(sprite.parent);
                        //Calculate delta of movement
                        const deltaX = newPosition.x - sprite.x;
                        const deltaY = newPosition.y - sprite.y;
                        const newPoints = [
                            ...points_.slice(0, index),
                            point + deltaX,
                            points_[index + 1] + deltaY,
                            ...points_.slice(index + 2)
                        ];
                        // console.log("Old points: ", points);
                        // console.log("New points: ", newPoints);
                        // Update the point
                        setPoints([...newPoints]);
                    }
                }}
            />
        );
    }
};

const Polygon = ({
                     points: points_,
                     size,
                     position,
                     setPosition,
                     setPoints,
                     rectPosition,
                     setRectSize,
                     setRectPosition,
                     rectSize
                 }) => {


    return (
        <>
            <Graphics
                draw={(g) => drawPolygon(g, points_)}
                width={size.width}
                height={size.height}
                key={points_.toString()}
            />

            {points_.map((point, index) => drawPoint(index, point, points_, setPoints))}

            <Sprite
                texture={PIXI.Texture.WHITE}
                // Purple color
                tint={0x112242}
                anchor={0.5}
                zIndex={3}
                interactive
                buttonMode={true}
                x={size.width / 2}
                y={size.height / 2}
                width={6} // Slightly larger size
                height={6}
                pointerdown={(event) => {
                    const sprite = event.currentTarget;
                    sprite.alpha = 0.5;
                    sprite.data = event.data;
                    sprite.dragging = true;
                }}
                pointerup={(event) => {
                    const sprite = event.currentTarget;
                    sprite.alpha = 1;
                    sprite.dragging = false;
                    sprite.data = null;
                }}
                pointerupoutside={(event) => {
                    const sprite = event.currentTarget;
                    sprite.alpha = 1;
                    sprite.dragging = false;
                    sprite.data = null;
                }}
                pointermove={(event) => {
                    const sprite = event.currentTarget;
                    if (sprite.dragging) {
                        const newPosition = sprite.data?.getLocalPosition(sprite.parent);
                        //Calculate delta of movement
                        const deltaX = newPosition.x - sprite.x;
                        const deltaY = newPosition.y - sprite.y;
                        setPosition({
                            x: position.x + deltaX,
                            y: position.y + deltaY,
                        })
                    }
                }}
            />
        </>
    );
};

export default Polygon;
