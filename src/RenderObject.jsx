import React from "react";
import data from "./data.json";
import {Graphics, Sprite, Stage, Text} from "@inlet/react-pixi";
import * as PIXI from "pixi.js";
import "./global.css";

const RenderObject = () => {
    const {data: data_} = data;
    const [objects, setObjects] = React.useState(data_);
    return (
        <div
        >
            <Stage width={400} height={300} options={{backgroundColor: 0x1099bb}}>
                {objects.map((object, index) => {
                    if (object.type == 'rectangle') {
                        return <RenderRectangle data={object} index={index}/>
                    }
                })}
            </Stage>

            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}
            >
                {objects.map((object, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                border: "1px solid black",
                                padding: "10px",
                            }}
                        >
                            <h3>
                                {object.type}-{object.id}
                            </h3>
                            <pre
                                style={{
                                    fontSize: "20px",
                                }}
                            >
                                {JSON.stringify(object, null, 2)}
                            </pre>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

const RenderRectangle = ({data, index}) => {
    const {
        id,
        type,
        is_visible,
        is_resizeable,
        object,
        limit,
        resizeable_points,
        resizeable_options,
        fixed_sides,
        fixed_corner_index
    } = data;

    const [rectSize, setRectSize] = React.useState({
        width: object.width,
        height: object.height,
        x: object.x,
        y: object.y
    });

    if (!is_visible) {
        return null;
    }

    const handleCornerDrag = (cornerIndex, deltaX, deltaY) => {
        const newSize = {...rectSize};
        const newPosition = {...rectSize};
        let isHeightFixed = false;
        let isWidthFixed = false;

        if (fixed_sides) {
            if (fixed_sides.includes('l')) {
                isHeightFixed = true;
            } else if (fixed_sides.includes('b')) {
                isWidthFixed = true;
            }
        }


        if (limit) {
            const currentHeight = newSize.height;
            const currentWidth = newSize.width;
            if (limit['l']) {
                if (currentHeight + deltaY < limit['l'][0]) {
                    return;
                } else if (currentHeight + deltaY > limit['l'][1]) {
                    return;
                }
            }
            if (limit['b']) {
                if (currentWidth + deltaX < limit['b'][0]) {
                    return;
                } else if (currentWidth + deltaX > limit['b'][1]) {
                    return;
                }
            }
        }

        if (resizeable_options) {
            const {type} = resizeable_options;
            if (type === 'discrete') {
                const {step} = resizeable_options;
                if (step) {
                    // Increase size by step
                    // Calculate the step-aligned delta values
                    const stepAlignedDeltaX = isWidthFixed ? 0 : Math.round(deltaX / step) * step;
                    const stepAlignedDeltaY = isHeightFixed ? 0 : Math.round(deltaY / step) * step;

                    switch (cornerIndex) {
                        case 0: // Top-left corner
                            newSize.width -= stepAlignedDeltaX;
                            newSize.height -= stepAlignedDeltaY;
                            // newPosition.x += stepAlignedDeltaX;
                            // newPosition.y += stepAlignedDeltaY;
                            break;
                        case 1: // Top-right corner
                            newSize.width += stepAlignedDeltaX;
                            newSize.height -= stepAlignedDeltaY;
                            // newPosition.y += stepAlignedDeltaY;
                            break;
                        case 2: // Bottom-right corner
                            newSize.width += stepAlignedDeltaX;
                            newSize.height += stepAlignedDeltaY;
                            break;
                        case 3: // Bottom-left corner
                            newSize.width -= stepAlignedDeltaX;
                            newSize.height += stepAlignedDeltaY;
                            // newPosition.x += stepAlignedDeltaX;
                            break;
                        default:
                            break;
                    }
                    setRectSize(newSize);
                    return;
                }
            }
        }

        switch (cornerIndex) {
            case 0: // Top-left corner
                // Only change the height and width, also dont change the position of the opposite corner
                newSize.width -= deltaX;
                newSize.height -= deltaY;
                // newPosition.x += deltaX;
                // newPosition.y += deltaY;

                break;
            case 1: // Top-right corner
                newSize.width += deltaX;
                newSize.height -= deltaY;
                // newPosition.y += deltaY;
                break;
            case 2: // Bottom-right corner
                newSize.width += deltaX;
                newSize.height += deltaY;
                break;
            case 3: // Bottom-left corner
                newSize.width -= deltaX;
                newSize.height += deltaY;
                // newPosition.x += deltaX;
                break;
            default:
                break;
        }

        setRectSize(newSize);
    };

    const getResizeablePointX = (cornerIndex) => {
        if (fixed_corner_index != null) {
            switch (fixed_corner_index) {
                case 0:
                    return rectSize.x + (cornerIndex === 0 || cornerIndex === 3 ? 0 : rectSize.width);
                case 1:
                    return rectSize.x + (cornerIndex === 0 || cornerIndex === 3 ? -1 * rectSize.width : 0);
                case 2:
                    return rectSize.x + (cornerIndex === 0 || cornerIndex === 3 ? -1 * rectSize.width : 0);
                case 3:
                    return rectSize.x + (cornerIndex === 0 || cornerIndex === 3 ? 0 : rectSize.width);
                default:
                    break;
            }
        } else {
            return rectSize.x + (cornerIndex === 0 || cornerIndex === 3 ? 0 : rectSize.width);

        }
    };

    const getResizeablePointY = (cornerIndex) => {
        if (fixed_corner_index != null) {
            switch (fixed_corner_index) {
                case 0:
                    return rectSize.y + (cornerIndex === 0 || cornerIndex === 1 ? 0 : rectSize.height);
                case 1:
                    return rectSize.y + (cornerIndex === 0 || cornerIndex === 1 ? 0 : rectSize.height);
                case 2:
                    return rectSize.y + (cornerIndex === 0 || cornerIndex === 1 ? -1 * rectSize.height : 0);
                case 3:
                    return rectSize.y + (cornerIndex === 0 || cornerIndex === 1 ? -1 * rectSize.height : 0);
                default:
                    break;
            }
        } else {
            return rectSize.y + (cornerIndex === 0 || cornerIndex === 1 ? 0 : rectSize.height);
        }
    }

    return (
        <>
            <Graphics
                key={index}
                zIndex={3}
                draw={g => {
                    g.clear();
                    g.lineStyle(2, 0x000000, 1);
                    g.beginFill(object.fill, 0.5);
                    if (fixed_corner_index !== null) {
                        switch (fixed_corner_index) {
                            case 0:
                                g.drawRect(rectSize.x, rectSize.y, rectSize.width, rectSize.height);
                                break;
                            case 1:
                                g.drawRect(rectSize.x - rectSize.width, rectSize.y, rectSize.width, rectSize.height);
                                break;
                            case 2:
                                g.drawRect(rectSize.x - rectSize.width, rectSize.y - rectSize.height, rectSize.width, rectSize.height);
                                break;
                            case 3:
                                g.drawRect(rectSize.x, rectSize.y - rectSize.height, rectSize.width, rectSize.height);
                                break;
                            default:
                                break;
                        }
                    }

                    g.endFill()
                }}
            />


            {is_resizeable && [0, 1, 2, 3].map(cornerIndex => {
                if (resizeable_points[cornerIndex]) {
                    return (
                        <>
                            <Sprite
                                key={cornerIndex}
                                texture={PIXI.Texture.WHITE}
                                tint={cornerIndex === fixed_corner_index ? 0x000000 : 0x2952A3}
                                anchor={0.5}
                                borderRadius={40}
                                zIndex={3}
                                //Take in account fixed corner
                                x={getResizeablePointX(cornerIndex)}
                                y={getResizeablePointY(cornerIndex)}
                                // x={rectSize.x + (cornerIndex === 0 || cornerIndex === 3 ? 0 : rectSize.width)}
                                // y={rectSize.y + (cornerIndex === 0 || cornerIndex === 1 ? 0 : rectSize.height)}
                                // x={rectSize.x + (cornerIndex === 0 || cornerIndex === 3 ? -1 * rectSize.width / 2 : rectSize.width / 2)}
                                // y={rectSize.y + (cornerIndex === 0 || cornerIndex === 1 ? -1 * rectSize.height / 2 : rectSize.height / 2)}
                                interactive
                                buttonMode={!(cornerIndex === fixed_corner_index)}
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
                                    if (!sprite.dragging) return;

                                    if (sprite.dragging) {
                                        const newPosition = sprite.data.getLocalPosition(sprite.parent);
                                        const deltaX = newPosition.x - sprite.x;
                                        const deltaY = newPosition.y - sprite.y;
                                        handleCornerDrag(cornerIndex, deltaX, deltaY);
                                    }
                                }}
                            />

                            {/*    Text*/}
                            <Text
                                key={cornerIndex}
                                text={`(${
                                    Math.round(rectSize.x + (cornerIndex === 0 || cornerIndex === 3 ? -1 * rectSize.width / 2 : rectSize.width / 2))
                                },${
                                    Math.round(rectSize.y + (cornerIndex === 0 || cornerIndex === 1 ? -1 * rectSize.height / 2 : rectSize.height / 2))
                                })`}
                                anchor={0.5}
                                zIndex={3}
                                x={getResizeablePointX(cornerIndex)}
                                y={getResizeablePointY(cornerIndex) - 10}
                                // x={rectSize.x + (cornerIndex === 0 || cornerIndex === 3 ? -1 * rectSize.width / 2 : rectSize.width / 2)}
                                // y={rectSize.y + (cornerIndex === 0 || cornerIndex === 1 ? -1 * rectSize.height / 2 : rectSize.height / 2)}
                                // Font size
                                style={{
                                    fontSize: 10,
                                }}

                            />
                        </>
                    )
                }
            })}

        </>
    )
};

export default RenderObject;
