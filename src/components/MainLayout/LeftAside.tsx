import {
    Box,
    Button,
    Divider,
    Icon,
    MenuItem,
    Paper,
    Stack, Theme,
    Typography,
} from "@mui/material";
import {forwardRef, MouseEvent, PropsWithChildren, ReactNode, useEffect, useState} from "react";
import {Link as RouterLink, LinkProps, useLocation, useNavigate} from "react-router-dom";
import {ROUTES} from "../../constants/routes.ts";
import MapIcon from '@mui/icons-material/Map';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import {useCreateCarTaskMutation, useGetCarPositionQuery} from "../../api/carApi.ts";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ListAltIcon from '@mui/icons-material/ListAlt';

const CustomLink = forwardRef<HTMLAnchorElement, LinkProps>(
    ({to, onClick, ...rest}, ref) => {
        const handleClick = (
            e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
        ) => {

            onClick?.(e);
        };

        return <RouterLink to={to} onClick={handleClick} {...rest} ref={ref}/>;
    },
);


export const LeftAside = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const {data: carPositionData, error} = useGetCarPositionQuery(undefined, {
        pollingInterval: 500,
        skip: false,
    });
    const [createCarTask] = useCreateCarTaskMutation()


    const [jsonData, setJsonData] = useState({x: 0, y: 0, status: ''})


    useEffect(() => {
        if (error) {
            return;
        }



        if (carPositionData) {
            setJsonData({
                x: +carPositionData.car_x, // Use values from carPositionData
                y: +carPositionData.car_y,
                status: carPositionData.car_status,
            });

            console.log(JSON.stringify(carPositionData.car_status))
        }
    }, [carPositionData]); // Include dependencies;

    console.log(jsonData.status)


    const handleLogoutClick = () => {
        navigate('/')
    };

    return (
        <Stack gap={2}>
            <Paper
                component={"aside"}
                sx={{
                    minWidth: "234px",
                    height: '50vh',
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    px: 0,
                    py: 2,
                }}
            >
                <Stack gap={0}>
                    <Stack direction={'row'} alignItems={'center'} sx={{pb: 3, pl: 2}}>
                        <DirectionsCarIcon/>
                        <Typography variant={'h3'}>Sentinel Office Delivery</Typography>
                    </Stack>
                    <AsideItem

                        url={ROUTES.map}
                        isActive={location.pathname === ROUTES.map}
                        icon={<MapIcon/>}
                    >
                        <Typography>Карта</Typography>
                    </AsideItem>
                    <AsideItem
                        url={ROUTES.places}
                        isActive={location.pathname === ROUTES.places}
                        icon={<PersonPinCircleIcon/>}
                    >
                        <Typography>Места</Typography>
                    </AsideItem>
                    <AsideItem
                        url={ROUTES.users}
                        isActive={location.pathname === ROUTES.users}
                        icon={<PeopleAltIcon/>}
                    >
                        <Typography>Сотрудники</Typography>
                    </AsideItem>
                    <AsideItem
                        url={ROUTES.history}
                        isActive={location.pathname === ROUTES.history}
                        icon={<ListAltIcon/>}
                    >
                        <Typography>История поездок</Typography>
                    </AsideItem>

                </Stack>
            </Paper>
            <Paper component={"aside"}
                   sx={{
                       minWidth: "234px",
                       height: '50vh',
                       display: "flex",
                       flexDirection: "column",
                       justifyContent: 'space-between',
                       p: 2
                   }}>
                <Typography variant={'h3'} alignSelf={'center'}>
                    Информация
                </Typography>
                <Stack gap={2}>
                    <Stack gap={1}>
                        <Typography sx={{mt: 2, fontWeight: '700'}}>
                            Статус курьера:
                        </Typography>
                        <Stack direction={'row'} alignItems={'center'}>
                            <Box sx={{
                                backgroundColor: jsonData.status === 'busy' ? "#FF5569" : "#91C951",
                                width: '15px',
                                height: '15px',
                                borderRadius: '50%'
                            }}>
                            </Box>
                            {jsonData.status === 'busy' ? 'Занят' : 'Свободен'}
                        </Stack>
                    </Stack>

                    <Stack sx={{mt: 3}}>
                        <Typography sx={{fontWeight: '700'}}>Текущая позиция:</Typography>
                        {<Typography>Y координат: {jsonData.x}</Typography>}
                        {<Typography>Y координат: {jsonData.y}</Typography>}
                    </Stack>
                    <Button color={'error'} onClick={() => createCarTask({x: 0, y: 0})}>Остановить доставку</Button>
                </Stack>

            </Paper>

            <Paper>
                <Stack sx={{px: "15px"}}>
                    <Button
                        variant="text"
                        color="secondary"
                        size="small"
                        onClick={handleLogoutClick}
                        sx={{
                            justifyContent: "flex-start",
                        }}
                    >
                        <Stack direction={"row"} alignItems={"center"}>
                            <LogoutIcon/>
                            <Typography fontWeight={400} textAlign={"left"}>
                                Выход
                            </Typography>
                        </Stack>
                    </Button>
                    <Divider/>
                    <Typography sx={{color: (theme) => theme.palette.grey[300]}}>
                        version 1.0.1
                    </Typography>
                </Stack>
            </Paper>
        </Stack>
    );


};

const AsideItem = ({
                       children,
                       url,
                       isActive,
                       icon,
                   }: PropsWithChildren<{
    url: string;
    isActive?: boolean;
    icon?: ReactNode;
}>) => {


    return (
        <MenuItem
            component={CustomLink}
            to={url}
            sx={{
                justifyContent: "space-between",
                px: "20px",
                height: 40,
                borderRadius: 0,
                backgroundColor: isActive ? "#25252E" : undefined,
                borderRight: "2px solid",
                borderRightColor: isActive
                    ? (theme: Theme) => theme.palette.primary.main
                    : "transparent",
                transition: "border-color 0.2s, background-color 0.1s",
                "&:hover .new-window-container": {
                    opacity: 1,
                },
            }}
        >
            <Stack direction={"row"} gap={1.5} alignItems={"center"}>
                <Icon
                    sx={{
                        width: "unset",
                        height: "unset",
                        "& path": {
                            transition: "fill 0.2s",
                            fill: (theme) =>
                                isActive ? theme.palette.primary.main : undefined,
                        },
                    }}
                >
                    {icon}
                </Icon>
                <Typography
                    color={isActive ? "textSecondary" : "textPrimary"}
                    sx={{textDecoration: "none"}}
                >
                    {children}
                </Typography>
            </Stack>
        </MenuItem>
    );
};
