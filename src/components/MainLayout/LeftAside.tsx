import {
    Button,
    Divider,
    Icon,
    MenuItem,
    Paper,
    Stack, Theme,
    Typography,
} from "@mui/material";
import {forwardRef, MouseEvent, PropsWithChildren, ReactNode} from "react";
import { Link as RouterLink, LinkProps, useLocation } from "react-router-dom";
import {ROUTES} from "../../constants/routes.ts";
import MapIcon from '@mui/icons-material/Map';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';

const CustomLink = forwardRef<HTMLAnchorElement, LinkProps>(
    ({ to, onClick, ...rest }, ref) => {
        const handleClick = (
            e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
        ) => {

            onClick?.(e);
        };

        return <RouterLink to={to} onClick={handleClick} {...rest} ref={ref} />;
    },
);


export const LeftAside = () => {


    const location = useLocation();


    const handleLogoutClick = () => {
        console.log('log out')
    };

    return (
        <Paper
            component={"aside"}
            sx={{
                minWidth: "234px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                px: 0,
                py: 2,
            }}
        >
            <Stack gap={0}>
                <AsideItem
                    url={ROUTES.root}
                    isActive={location.pathname === ROUTES.root}
                    icon={<MapIcon/>}
                >
                    <Typography>Карта</Typography>
                </AsideItem>
                <AsideItem
                    url={ROUTES.positions}
                    isActive={location.pathname === ROUTES.positions}
                    icon={<PersonPinCircleIcon/>}
                >
                    <Typography>Места</Typography>
                </AsideItem>

            </Stack>
            <Stack sx={{ px: "15px" }}>
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
                        <LogoutIcon />
                        <Typography fontWeight={400} textAlign={"left"}>
                            Выход
                        </Typography>
                    </Stack>
                </Button>
                <Divider />
                <Typography sx={{ color: (theme) => theme.palette.grey[300] }}>
                    version 1.0.1
                </Typography>
            </Stack>
        </Paper>
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
                    sx={{ textDecoration: "none" }}
                >
                    {children}
                </Typography>
            </Stack>
        </MenuItem>
    );
};
