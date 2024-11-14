import { Button, Stack, TextField, Typography} from "@mui/material";
import {useState} from "react";

export const MapPage = () => {
    const [xValue, setXValue] = useState('');
    const [yValue, setYValue] = useState('');

    const handleSendCoords = () => {
        fetch('http://10.20.0.15:8888/order/send_coords_from_web', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                x: xValue,
                y: yValue
            })
        })

    };

    const handleGetCarCoords = () => {
        fetch('http://10.20.0.15:8888/order/get_order_coords', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
    };

    const handleGetRobotCoords = () => {
        fetch('http://10.20.0.15:8888/car/car_data', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
    };


    return (
        <>
            <Stack direction="row">
                <Stack sx={{width: '250px', border: '1px solid gray', p: 2, borderRadius: 3}}>
                    <Typography>Create Task</Typography>
                    <TextField placeholder={'x'}
                               value={xValue}
                               onChange={(e) => setXValue(e.target.value)}/>
                    <TextField placeholder={'y'}
                               value={yValue}
                               onChange={(e) => setYValue(e.target.value)}/>
                    <Button onClick={handleSendCoords}>Send robot coords</Button>
                    <Button onClick={handleGetCarCoords}>Get order coords</Button>
                    <Button onClick={handleGetRobotCoords}>Get robot coords</Button>
                </Stack>

            </Stack>
        </>
    );
};
