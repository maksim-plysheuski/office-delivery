import React, {useEffect, useState} from 'react';
import officeRoomImage from '../../assets/mapImg.jpg';
import {Stage, Layer, Image as KonvaImage, Circle, Text, Rect} from 'react-konva';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button} from '@mui/material';
import {useCreateCarTaskMutation, useGetCarPositionQuery} from "../../api/carApi.ts";

export const MapPage = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState<{ place: number; x: number; y: number } | null>(null);

    const [createCarTask] = useCreateCarTaskMutation()
    const {data: carPositionData} = useGetCarPositionQuery(undefined, {
        pollingInterval: 1000,
        skip: false,
    });

    const [movingMarker, setMovingMarker] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        if (carPositionData) {
            const {x, y} = carPositionData;
            const imageCoords = convertToImageCoordinates(+x, +y)
            setMovingMarker(imageCoords)
        }
    }, [carPositionData]);

    console.log(movingMarker)


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


    // Define the list of static markers with their real-world coordinates in meters
    const markers = [
        {place: 1, x: 1.1, y: 1.3},
        {place: 2, x: 2.3, y: 1.3},
        {place: 3, x: 3.7, y: 1.3},
        {place: 4, x: 5.2, y: 1.3},
        {place: 5, x: 1.1, y: 4.6},
        {place: 6, x: 2.3, y: 4.6},
        {place: 7, x: 3.7, y: 4.6},
        {place: 8, x: 5.2, y: 4.6},
        {place: 9, x: 1.1, y: 7.6},
        {place: 10, x: 2.3, y: 7.6},
        {place: 11, x: 3.7, y: 7.6},
        {place: 12, x: 5.2, y: 7.6},
        {place: 13, x: 1.1, y: 10.6},
        {place: 14, x: 2.3, y: 10.6},
        {place: 15, x: 3.7, y: 10.6},
        {place: 16, x: 5.2, y: 10.6},
        {place: 17, x: 1.1, y: 13.9},
        {place: 18, x: 2.3, y: 13.9},
        {place: 19, x: 3.7, y: 13.9},
        {place: 20, x: 5.2, y: 13.9},
        {place: 21, x: 1.1, y: 17.1},
        {place: 22, x: 2.3, y: 17.1},
        {place: 23, x: 3.7, y: 17.1},
        {place: 24, x: 5.2, y: 17.1},
        {place: 25, x: 0.3, y: 20.3},
        {place: 26, x: 1.1, y: 20.3},
        {place: 27, x: 2.3, y: 20.3},
        {place: 28, x: 3.7, y: 20.3},
        {place: 29, x: 5.2, y: 20.3},
        {place: 30, x: 0.3, y: 23.2},
        {place: 31, x: 1.1, y: 23.2},
        {place: 32, x: 2.3, y: 23.2},
        {place: 33, x: 3.7, y: 23.2},
        {place: 34, x: 5.2, y: 23.2},
        {place: 35, x: 8.5, y: 20.3},
        {place: 36, x: 14, y: 0.3},
    ];


    // Handle marker click to open dialog with marker details
    const handleMarkerClick = (marker: { place: number; x: number; y: number }) => {
        setSelectedMarker(marker);
        setShowDialog(true);
    };

    // Close dialog handler
    const handleClose = () => {
        setShowDialog(false);
        setSelectedMarker(null);
    };

    // Handle button click in dialog to send request
    const handleRequest = () => {
        if (selectedMarker) {
            createCarTask({x: String(selectedMarker.x), y: String(selectedMarker.y)})
                .unwrap()
                .finally(() => handleClose());
        }
    };


    return (
        <>
            <Stage
                width={window.innerWidth - 190}
                height={window.innerHeight - 32}
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
                        strokeWidth={3}
                        dash={[10, 5]}
                    />

                    {/* Render static markers with place number labels */}
                    {markers.map((marker) => {
                        const imageCoords = convertToImageCoordinates(marker.x, marker.y);
                        return (
                            <React.Fragment key={marker.place}>
                                {/* Invisible clickable zone */}
                                <Circle
                                    x={imageCoords.y + boundary.x}
                                    y={imageCoords.x + boundary.y}
                                    radius={30}  // Increase radius for wider clickable area


                                />
                                {/* Visible marker */}
                                <Circle
                                    x={imageCoords.y + boundary.x}  // Horizontal (Y) as x
                                    y={imageCoords.x + boundary.y}  // Vertical (X) as y
                                    radius={20}
                                    fill="#798AFF"
                                    stroke="black"
                                    strokeWidth={3}
                                    onClick={() => handleMarkerClick(marker)}
                                    onMouseEnter={(e) => e.target.getStage().container().style.cursor = 'pointer'}
                                    onMouseLeave={(e) => e.target.getStage().container().style.cursor = 'default'}

                                />
                                <Text
                                    x={imageCoords.y + boundary.x - 12}  // Center text within marker
                                    y={imageCoords.x + boundary.y - 8}
                                    text={String(marker.place)}
                                    fontSize={20}
                                    fill="white"
                                    onClick={() => handleMarkerClick(marker)}
                                    onMouseEnter={(e) => e.target.getStage().container().style.cursor = 'pointer'}
                                    onMouseLeave={(e) => e.target.getStage().container().style.cursor = 'default'}
                                />
                            </React.Fragment>
                        );
                    })}

                    {/* Render the moving yellow marker */}
                    {movingMarker && <Circle
                        x={movingMarker.y + boundary.x}
                        y={movingMarker.x + boundary.y}
                        radius={20}
                        fill="yellow"
                        stroke="black"
                        strokeWidth={3}
                    />}
                </Layer>
            </Stage>

            {/* Dialog to show marker details */}
            <Dialog open={showDialog} onClose={handleClose}>
                <DialogTitle>Marker Details</DialogTitle>
                <DialogContent>
                    {selectedMarker && (
                        <div>
                            <p>Place Number: {selectedMarker.place}</p>
                            <p>Coordinates: X = {selectedMarker.x}, Y = {selectedMarker.y}</p>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                    <Button onClick={handleRequest} color="secondary" variant="contained">
                        Send Request
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
