import React from "react";
import {Sprite, Stage, Graphics} from "@inlet/react-pixi";
import {useState} from "react";
import * as PIXI from "pixi.js";

const Quadilateral = () => {
    const [position, setPosition] = useState({x: 100, y: 100});
    const [size, setSize] = useState({width: 100, height: 100});
    const handleResize = (deltaWidth, deltaHeight) => {
        setSize({
            width: Math.max(50, size.width + deltaWidth),
            height: Math.max(50, size.height + deltaHeight),
        });
    }

    return (
        <Stage width={400} height={400}
               options={{backgroundColor: 0x1099bb}}
        >
            <Sprite
                texture={PIXI.Texture.WHITE}
                // image={"https://picsum.photos/200/300"}

                anchor={0.5}
                zIndex={2}
                interactive
                buttonMode={true}
                // x={position.x}
                // y={position.y}
                // width={size.width}
                // height={size.height}
            />
            <Sprite
                texture={PIXI.Texture.WHITE}
                anchor={0.5}
                zIndex={2}
                interactive
                buttonMode={true}
                x={position.x + size.width / 2}
                y={position.y + size.height / 2}

                width={10}
                height={10}
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
                        console.log(deltaX, deltaY)
                        handleResize(deltaX, deltaY)
                    }
                }}
            />
        </Stage>
    )

};
export default Quadilateral;
