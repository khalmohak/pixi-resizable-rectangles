import React, {useEffect, useState} from 'react';
import {Container, Graphics, Sprite, Stage} from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const DraggableCornerRectangleWithChild = ({
                                               children,
                                               points,
                                               position,
                                               rectPosition,
                                               setRectSize,
                                               setRectPosition,
                                               rectSize
                                           }) => {
    useEffect(() => {
        const points_ = getBoundingBox(points)
        setRectSize({width: points_.width, height: points_.height})
        setRectPosition({x: position.x, y: position.y})
    }, []);

    useEffect(() => {
        setRectPosition({
            x: position.x,
            y: position.y
        })
    }, [position])

    // From an array of points of a polygon, get the bounding box
    const getBoundingBox = (points) => {
        // xCoordinates are all odd indexes
        const xCoordinates = points.filter((_, index) => index % 2 === 0);
        // yCoordinates are all even indexes
        const yCoordinates = points.filter((_, index) => index % 2 === 1);

        const minX = Math.min(...xCoordinates);
        const maxX = Math.max(...xCoordinates);
        const minY = Math.min(...yCoordinates);
        const maxY = Math.max(...yCoordinates);


        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
        };
    }


    // const [rectPosition, setRectPosition] = useState({x: 100, y: 100});
    // const [rectSize, setRectSize] = useState({width: 200, height: 150});

    const handleSideDrag = (sideIndex, deltaX, deltaY) => {
        const newSize = {...rectSize};
        const newPosition = {...rectPosition};

        switch (sideIndex) {
            case 0: // Top side
                newSize.height -= deltaY;
                newPosition.y += deltaY;
                break;
            case 1: // Right side
                newSize.width += deltaX;
                break;
            case 2: // Bottom side
                newSize.height += deltaY;
                break;
            case 3: // Left side
                newSize.width -= deltaX;
                newPosition.x += deltaX;
                break;
            default:
                break;
        }

        setRectSize(newSize);
        setRectPosition(newPosition);

        //Change the points of the polygon to match the new rectangle
    };

    const handleCornerDrag = (cornerIndex, deltaX, deltaY) => {
        const newSize = {...rectSize};
        const newPosition = {...rectPosition};

        switch (cornerIndex) {
            case 0: // Top-left corner
                newSize.width -= deltaX;
                newSize.height -= deltaY;
                newPosition.x += deltaX;
                newPosition.y += deltaY;
                break;
            case 1: // Top-right corner
                newSize.width += deltaX;
                newSize.height -= deltaY;
                newPosition.y += deltaY;
                break;
            case 2: // Bottom-right corner
                newSize.width += deltaX;
                newSize.height += deltaY;
                break;
            case 3: // Bottom-left corner
                newSize.width -= deltaX;
                newSize.height += deltaY;
                newPosition.x += deltaX;
                break;
            default:
                break;
        }

        setRectSize(newSize);
        setRectPosition(newPosition);
    };

    return (<Stage width={800} height={600} options={{backgroundColor: 0x1099bb}}>
        <Container>
            <Graphics
                draw={(g) => {
                    g.clear();
                    g.lineStyle(2, 0x3366cc); // Use a sleeker blue color for the border
                    g.drawRect(rectPosition.x, rectPosition.y, rectSize.width, rectSize.height);
                }}
            />

            {[0, 1, 2, 3].map(cornerIndex => (
                <Sprite
                    key={cornerIndex}
                    texture={PIXI.Texture.WHITE}
                    // Red
                    // tint={0xff0000}
                    anchor={0.5}
                    //Border radius
                    borderRadius={20}
                    interactive
                    buttonMode={true}
                    x={
                        rectPosition.x + (cornerIndex === 1 || cornerIndex === 2 ? rectSize.width : 0)
                    }
                    y={
                        rectPosition.y + (cornerIndex === 2 || cornerIndex === 3 ? rectSize.height : 0)
                    }
                    width={8}
                    height={8}
                    pointerdown={event => {
                        const sprite = event.currentTarget;
                        sprite.alpha = 0.5;
                        sprite.data = event.data;
                        sprite.dragging = true;
                    }}
                    pointerup={event => {
                        const sprite = event.currentTarget;
                        sprite.alpha = 1;
                        sprite.dragging = false;
                        sprite.data = null;
                    }}
                    pointerupoutside={event => {
                        const sprite = event.currentTarget;
                        sprite.alpha = 1;
                        sprite.dragging = false;
                        sprite.data = null;
                    }}
                    pointermove={event => {
                        const sprite = event.currentTarget;
                        if (sprite.dragging) {
                            const newPosition = sprite.data.getLocalPosition(sprite.parent);
                            const deltaX = newPosition.x - sprite.x;
                            const deltaY = newPosition.y - sprite.y;
                            handleCornerDrag(cornerIndex, deltaX, deltaY);
                        }
                    }}
                />))}

            {[0, 1, 2, 3].map(sideIndex => (
                <Sprite
                    key={sideIndex}
                    texture={PIXI.Texture.WHITE}
                    anchor={0.5}
                    zIndex={5}
                    interactive
                    buttonMode={true}
                    x={
                        sideIndex === 0 ? rectPosition.x + rectSize.width / 2 :
                            sideIndex === 1 ? rectPosition.x + rectSize.width :
                                sideIndex === 2 ? rectPosition.x + rectSize.width / 2 :
                                    rectPosition.x
                    }
                    y={
                        sideIndex === 0 ? rectPosition.y :
                            sideIndex === 1 ? rectPosition.y + rectSize.height / 2 :
                                sideIndex === 2 ? rectPosition.y + rectSize.height :
                                    rectPosition.y + rectSize.height / 2
                    }
                    width={sideIndex === 0 || sideIndex === 2 ? rectSize.width : 4}
                    height={sideIndex === 1 || sideIndex === 3 ? rectSize.height : 4}
                    pointerdown={event => {
                        const sprite = event.currentTarget;
                        sprite.alpha = 0.5;
                        sprite.data = event.data;
                        sprite.dragging = true;
                    }}
                    pointerup={event => {
                        const sprite = event.currentTarget;
                        sprite.alpha = 1;
                        sprite.dragging = false;
                        sprite.data = null;
                    }}
                    pointerupoutside={event => {
                        const sprite = event.currentTarget;
                        sprite.alpha = 1;
                        sprite.dragging = false;
                        sprite.data = null;
                    }}
                    pointermove={event => {
                        const sprite = event.currentTarget;
                        if (sprite.dragging) {
                            const newPosition = sprite.data.getLocalPosition(sprite.parent);
                            const deltaX = newPosition.x - sprite.x;
                            const deltaY = newPosition.y - sprite.y;
                            handleSideDrag(sideIndex, deltaX, deltaY);
                        }
                    }}
                />
            ))}

            {/* Child component */}
            {/*{children && (*/}
            <Container
                x={rectPosition.x}
                y={rectPosition.y}
                width={rectSize.width}
                height={rectSize.height}

            >
                {children}

            </Container>


        </Container>
    </Stage>)
};

export default DraggableCornerRectangleWithChild;
