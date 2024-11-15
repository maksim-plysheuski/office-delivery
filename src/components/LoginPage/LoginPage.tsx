import {
    Box,
    Button,
    Divider,

    Paper,
    Stack, TextField,
    Typography,
} from "@mui/material";
import {useNavigate} from "react-router-dom";
import EmojiTransportationIcon from '@mui/icons-material/EmojiTransportation';


export const LoginPage = () => {
    const navigate = useNavigate()

    return (
        <Box
            sx={{
                position: "relative",
                minHeight: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 4,
            }}
        >

            <Paper sx={{padding: "40px", width: "400px"}}>
                <Stack component={"form"} gap={4}>
                    <Stack alignItems={"center"}>
                        <EmojiTransportationIcon fontSize={'large'}
                                                 sx={{color: "#798AFF", fontSize: 80}}/>
                        <Typography variant={'h2'}>Sentinel Office Delivery</Typography>
                    </Stack>
                    <Divider/>
                    <Stack flexDirection={'row'} justifyContent={'center'}>
                        <Typography variant={"h2"}>{'Вход'}</Typography>
                    </Stack>
                    <Stack gap={3}>
                        <TextField label={'Логин'} placeholder={'Введите логин'}/>
                        <TextField label={'Пароль'} type="password" placeholder={'Введите пароль'}/>
                    </Stack>
                    <Button variant="contained" onClick={() => navigate("/map")}>
                        {'Войти'}
                    </Button>

                </Stack>
            </Paper>
        </Box>
    );
};
