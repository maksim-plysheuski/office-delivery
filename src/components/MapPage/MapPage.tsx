import React, {useEffect, useState} from 'react';
import officeRoomImage from '../../assets/mapImg.jpg';
import carImage from '../../assets/carImage.png';
import homeImageIcon from '../../assets/homeIcon.png';
import {Stage, Layer, Image as KonvaImage, Circle, Text, Rect} from 'react-konva';
import FlagIcon from '@mui/icons-material/Flag';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Stack,
    Box,
    LinearProgress, LinearProgressProps, Paper
} from '@mui/material';
import {useCreateCarTaskMutation, useGetCarPositionQuery} from "../../api/carApi.ts";
import carStartAudio from '../../assets/carStartAudio.mp3'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {bgColors} from "../../constants";

export const MapPage = () => {
    const [image, setImage] = useState<HTMLImageElement | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState<{ place: number; x: number; y: number } | null>(null);
    const [markerImage, setMarkerImage] = useState<HTMLImageElement | null>(null)
    const [homeImage, setHomeImage] = useState<HTMLImageElement | null>(null)
    const [progress, setProgress] = useState(0);
    const [initialDistance, setInitialDistance] = useState<number | null>(null);


    const [createCarTask] = useCreateCarTaskMutation()
    const {data: carPositionData} = useGetCarPositionQuery(undefined, {
        pollingInterval: 500,
        skip: false,
    });


    const [movingMarker, setMovingMarker] = useState<{ x: number; y: number } | null>(null);

    const calculateDistance = (point1: { x: number; y: number }, point2: { x: number; y: number }) => {
        return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
    };

   
    console.log(movingMarker)

    useEffect(() => {
        if (carPositionData) {
            const {car_x, car_y} = carPositionData;
            //const imageCoords = convertToImageCoordinates(+car_x, +car_y)
            console.log(carPositionData)
            setMovingMarker({x: +car_x, y: +car_y})
        }
    }, [carPositionData]);


    // Real-world dimensions of the office room (in meters)
    const realRoomWidth = 24320; // Y dimension (horizontal)
    const realRoomHeight = 18550; // X dimension (vertical)

    // Padding from the top
    const paddingTop = 15;

    // Boundary coordinates and dimensions based on image dimensions
    const boundary = {
        x: 20,
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

        const markerImg = new window.Image();
        markerImg.src = carImage;
        markerImg.onload = () => {
            setMarkerImage(markerImg);
        };

        const homeImg = new window.Image();
        homeImg.src = homeImageIcon;
        homeImg.onload = () => {
            setHomeImage(homeImg);
        };
    }, []);

    // Convert real-world coordinates to image coordinates
    const convertToImageCoordinates = (realX: number, realY: number) => ({
        x: realX * scaleX,
        y: realY * scaleY,
    });


    // Define the list of static workPlaces with their real-world coordinates in meters
    const workPlaces = [
        {place: 1, x: 1100, y: 1300},
        {place: 2, x: 2300, y: 1300},
        {place: 3, x: 3700, y: 1300},
        {place: 4, x: 5200, y: 1300},
        {place: 5, x: 1100, y: 4600},
        {place: 6, x: 2300, y: 4600},
        {place: 7, x: 3700, y: 4600},
        {place: 8, x: 5200, y: 4600},
        {place: 9, x: 1100, y: 7600},
        {place: 10, x: 2300, y: 7600},
        {place: 11, x: 3700, y: 7600},
        {place: 12, x: 5200, y: 7600},
        {place: 13, x: 1100, y: 10600},
        {place: 14, x: 2300, y: 10600},
        {place: 15, x: 3700, y: 10600},
        {place: 16, x: 5200, y: 10600},
        {place: 17, x: 1100, y: 13900},
        {place: 18, x: 2300, y: 13900},
        {place: 19, x: 3700, y: 13900},
        {place: 20, x: 5200, y: 13900},
        {place: 21, x: 1100, y: 17100},
        {place: 22, x: 2300, y: 17100},
        {place: 23, x: 3700, y: 17100},
        {place: 24, x: 5200, y: 17100},
        {place: 25, x: 300, y: 20300},
        {place: 26, x: 1100, y: 20300},
        {place: 27, x: 2300, y: 20300},
        {place: 28, x: 3700, y: 20300},
        {place: 29, x: 5200, y: 20300},
        {place: 30, x: 300, y: 23200},
        {place: 31, x: 1100, y: 23200},
        {place: 32, x: 2300, y: 23200},
        {place: 33, x: 3700, y: 23200},
        {place: 34, x: 5200, y: 23200},
        {place: 35, x: 8500, y: 20300},
        {place: 36, x: 14000, y: 300},
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
        if (selectedMarker && movingMarker) {
            // Calculate and set initial distance
            const initialDist = calculateDistance(movingMarker, convertToImageCoordinates(selectedMarker.x, selectedMarker.y));
            setInitialDistance(initialDist);

            createCarTask({x: String(selectedMarker.x), y: String(selectedMarker.y)})
                .unwrap()
                .then(() => {
                    setTimeout(() => {
                        const audio = new Audio(carStartAudio);
                        audio.play();
                    }, 500);
                })
                .finally(() => handleClose());
        }
    };

    useEffect(() => {
        if (carPositionData && selectedMarker && initialDistance !== null) {
            const {car_x, car_y} = carPositionData;
            const imageCoords = convertToImageCoordinates(+car_x, +car_y);
            setMovingMarker(imageCoords);

            const currentDistance = calculateDistance(imageCoords, convertToImageCoordinates(selectedMarker.x, selectedMarker.y));

            const progressPercent = Math.max(0, Math.min(100, ((initialDistance - currentDistance) / initialDistance) * 100));
            setProgress(progressPercent);
        }
    }, [carPositionData, selectedMarker, initialDistance]);

    return (
        <>
            <Stack>
                <Box sx={{
                    height: '50px',
                    width: '100%',
                    backgroundColor: bgColors['300'],
                    borderRadius: 3,
                    p: 2
                }}>
                    <LinearProgressWithLabel value={progress}/>
                </Box>
                <Paper>
                    <Stage
                        width={window.innerWidth - 310}
                        height={window.innerHeight - 115}
                        style={{borderRadius: '16px'}}
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

                            {/* Render static workPlaces with place number labels */}
                            {workPlaces.map((marker) => {
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
                                        {marker.place === 36 ? (
                                            <KonvaImage
                                                image={homeImage as CanvasImageSource}
                                                x={imageCoords.y + boundary.x - 15}  // Horizontal (Y) as x
                                                y={imageCoords.x + boundary.y - 45}  // Vertical (X) as y
                                                width={55} // Width of the marker image
                                                height={50}


                                            />
                                        ) : (
                                            <>
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
                                            </>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {/* Render the moving yellow marker */}
                            {movingMarker && markerImage && (
                                <KonvaImage
                                    image={markerImage}
                                    x={movingMarker.y + boundary.x - 35} // Adjust to center the image
                                    y={movingMarker.x + boundary.y - 20} // Adjust to center the image
                                    width={115} // Width of the marker image
                                    height={70} // Height of the marker image
                                />
                            )}
                        </Layer>
                    </Stage>
                </Paper>
            </Stack>

            {/* Dialog to show marker details */}
            <Dialog open={showDialog} onClose={handleClose}>
                <DialogTitle>Оформление доставки</DialogTitle>
                <DialogContent>
                    {selectedMarker && (
                        <div>
                            <Typography variant={'h3'}>Рабочее место: {selectedMarker.place}</Typography>

                        </div>
                    )}
                    <Stack direction="row" alignItems="center">

                        {carPositionData?.car_status!! === 'busy' && <>
                            <ErrorOutlineIcon color='error'/>
                            <Typography color='error'>Курьер в пути, заказ не доступен</Typography>
                        </>}

                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color={'secondary'}>
                        Закрыть
                    </Button>
                    <Button onClick={handleRequest} color="primary" disabled={carPositionData?.car_status!! === 'busy'}
                            variant="contained">
                        Закзать доставку
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Stack direction={'row'} alignItems={'center'} sx={{ mr: 1, width: '100%'}}>
                <LocalShippingIcon/>
                <Box sx={{ mr: 1, width: '100%'}}>
                    <LinearProgress  variant="determinate" {...props} />
                </Box>

            </Stack>
            <Box sx={{minWidth: 35}}>
                <Typography variant="body2" sx={{color: 'text.secondary'}}>{`${Math.round(props.value)}%`}</Typography>
            </Box>
            <FlagIcon/>
        </Box>
    );
}

