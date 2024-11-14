import officeRoomImage from '../../assets/mapImg.jpg';
import { useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Circle, Rect } from 'react-konva';

export const MapPage = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [markers, setMarkers] = useState<{ x: number; y: number }[]>([]);

    // Real-world dimensions of the office room (in meters)
    const realRoomWidth = 24.32; // Y dimension (horizontal)
    const realRoomHeight = 18.55; // X dimension (vertical)

    // Padding from the top
    const paddingTop = 15;

    // Boundary coordinates and dimensions based on image dimensions
    const boundary = {
        x: 40,
        y: paddingTop,
        width: window.innerWidth,
        height: window.innerHeight - paddingTop,
    };

    // Scaling factors to convert real-world coordinates to image coordinates
    const scaleX = boundary.height / realRoomHeight;
    const scaleY = boundary.width / realRoomWidth;

    useEffect(() => {
        const img = new window.Image();
        img.src = officeRoomImage;
        img.onload = () => {
            setImage(img);
        };
    }, []);

    // Convert real-world coordinates to image coordinates
    const convertToImageCoordinates = (realX: number, realY: number) => ({
        x: realX * scaleX,
        y: realY * scaleY,
    });

    // Handler for placing markers with real-world coordinate scaling
    const handleStageClick = (e: any) => {
        const stage = e.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        if (pointerPosition) {
            const { x, y } = pointerPosition;

            // Check if the point is inside the boundary
            if (
                x >= boundary.x &&
                x <= boundary.x + boundary.width &&
                y >= boundary.y &&
                y <= boundary.y + boundary.height
            ) {
                // Adjust marker coordinates to real-world scaled coordinates
                const adjustedX = (y - boundary.y) / scaleX;  // Convert to real-world X
                const adjustedY = (x - boundary.x) / scaleY;  // Convert to real-world Y

                setMarkers((prevMarkers) => [...prevMarkers, { x: adjustedX , y: adjustedY }]);

                console.log("Marker position in JSON:", { x: adjustedX, y: adjustedY });
            }
        }
    };

    return (
        <Stage
            width={window.innerWidth}
            height={window.innerHeight}
            onClick={handleStageClick}
        >
            <Layer>
                {/* Render the background image */}
                {image && (
                    <KonvaImage
                        image={image}
                        x={0}
                        y={0}
                        width={window.innerWidth}
                        height={window.innerHeight}
                    />
                )}

                {/* Render the boundary rectangle */}
                <Rect
                    x={boundary.x}
                    y={boundary.y}
                    width={boundary.width}
                    height={boundary.height}
                    stroke="blue"
                    strokeWidth={2}
                    dash={[10, 5]}
                />

                {/* Render markers within the boundary */}
                {markers.map((marker, index) => {
                    const imageCoords = convertToImageCoordinates(marker.x, marker.y);
                    return (
                        <Circle
                            key={index}
                            x={imageCoords.y + boundary.x}  // Horizontal (Y) as x
                            y={imageCoords.x + boundary.y}  // Vertical (X) as y
                            radius={10}
                            fill="red"
                            stroke="black"
                            strokeWidth={2}
                        />
                    );
                })}
            </Layer>
        </Stage>
    );
};
