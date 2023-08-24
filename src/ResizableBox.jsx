import React, {useState} from 'react';
import {Sprite, Stage} from "@inlet/react-pixi";

const ResizableBox = () => {
    const [position, setPosition] = useState({x: 100, y: 100});
    const [size, setSize] = useState({width: 100, height: 100});

    const handleDragEnd = (event) => {
        setPosition({x: event.target.x, y: event.target.y});
    };

    const handleResize = (deltaWidth, deltaHeight) => {
        setSize({
            width: Math.max(50, size.width + deltaWidth),
            height: Math.max(50, size.height + deltaHeight),
        });
    };

    return (
        <div>

            <Stage width={800} height={600}>
                <Sprite
                    x={position.x}
                    y={position.y}
                    width={size.width}
                    height={size.height}
                    interactive={true}
                    buttonMode={true}
                    draggable={true}
                    onDragEnd={handleDragEnd}
                    image={'https://pixijs.io/examples/examples/assets/bunny.png'}
                />

                {/*<Sprite*/}
                {/*    x={position.x + size.width - 10}*/}
                {/*    y={position.y + size.height - 10}*/}
                {/*    width={20}*/}
                {/*    height={20}*/}
                {/*    image={"https://pixijs.io/examples/examples/assets/bunny.png"}*/}
                {/*    anchor={0.5}*/}
                {/*    interactive*/}
                {/*    buttonMode*/}
                {/*    // onDrag={(event) => handleResize(event.data.originalEvent.movementX, event.data.originalEvent.movementY)}*/}
                {/*/>*/}
            </Stage>
        </div>

    );
};

export default ResizableBox;
