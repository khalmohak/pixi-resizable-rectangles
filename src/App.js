import React, {useState, useEffect} from "react";
import Polygon from "./Polygon";
import DraggableCornerRectangle from "./Rectangle";
import RenderObject from "./RenderObject";

const App = () => {
    //Centroid position
    const [position, setPosition] = useState({x: 20, y: 33});
    const [size, setSize] = useState({width: 100, height: 100});
    const [points, setPoints] = useState([
        0, 0,
        100, 0,
        100, 100,
        0, 100,
    ]);

    const [rectPosition, setRectPosition] = useState({x: 100, y: 100});
    const [rectSize, setRectSize] = useState({width: 200, height: 150});

    //Update the points of the polygon when the rectangle is moved, its size is changed, or the position is changes
    useEffect(() => {
        // Calculate updated points based on rectPosition and rectSize
        const updatedPoints = [...points];
        for (let i = 0; i < points.length; i += 2) {
            updatedPoints[i] = points[i] + rectPosition.x;
            updatedPoints[i + 1] = points[i + 1] + rectPosition.y;
        }
        setPoints(updatedPoints);
    }, [rectPosition, rectSize]);

    return <RenderObject/>

    return (
        <>
            <div>
                Points: {points.map((point, index) => {
                if (index % 2 === 0) {
                    return `(${
                        //Round to 2 decimal places
                        Math.round((point + position.x) * 100) / 100
                    },`;
                } else {
                    return `${
                        Math.round((point + position.x) * 100) / 100

                    }) , `;
                }
            })
            }
            </div>

            <button
                onClick={() => {
                    //Generate random polygon upto 5
                    const newPoints = [];
                    for (let i = 0; i < Math.floor(Math.random() * 5) + 3; i++) {
                        newPoints.push(Math.floor(Math.random() * 100));
                        newPoints.push(Math.floor(Math.random() * 100));
                    }
                    setPoints(newPoints);
                }}
            >
                Generate random polygon
            </button>

            <DraggableCornerRectangle
                points={points}
                setPoints={setPoints}
                position={position}
                rectPosition={rectPosition}
                setRectPosition={setRectPosition}
                rectSize={rectSize}
                setRectSize={setRectSize}
            >
                <Polygon
                    points={points}
                    setPoints={setPoints}
                    position={position}
                    setPosition={setPosition}
                    size={size}
                    setSize={setSize}
                    rectPosition={rectPosition}
                    setRectPosition={setRectPosition}
                    rectSize={rectSize}
                    setRectSize={setRectSize}
                />
            </DraggableCornerRectangle>

        </>
    )

};
export default App;
// ReactDOM.render(<App />, document.getElementById("root"));
