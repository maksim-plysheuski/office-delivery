import {
    Button,
    Divider,
    Icon, Link,
    MenuItem,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import {  PropsWithChildren, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import MapIcon from '@mui/icons-material/Map';
import LogoutIcon from '@mui/icons-material/Logout';
import {ROUTES} from "../../constants/routes.ts";


export const LeftAside = () => {



  const location = useLocation();


  const handleLogoutClick = () => {
      console.log('logout')
  };

  return (
    <Paper
      component={"aside"}
      sx={{
        minWidth: "150px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        px: 0,
        py: 2,
      }}
    >
      <Stack gap={0}>
        <AsideItem
          url={'/'}
          isActive={location.pathname === '/'}
          icon={<MapIcon/>}
        >
          Map
        </AsideItem>
          <AsideItem
              url={ROUTES.map}
              isActive={location.pathname === ROUTES.map}
              icon={<MapIcon/>}
          >
              Map 2
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

           <Stack>
               <Typography>Status</Typography>
           </Stack>
          <Stack direction={"row"} alignItems={"center"}>
            <LogoutIcon/>
          </Stack>
        </Button>
        <Divider />
        <Typography sx={{ color: (theme) => theme.palette.grey[300] }}>
          version 0.0.1
        </Typography>

      </Stack>
    </Paper>
  );
};

const AsideItem = ({
                       children,
                       isActive,
                       icon,
                   }: PropsWithChildren<{
    url: string;
    isActive?: boolean;
    icon?: ReactNode;
}>) => {


    return (
        <MenuItem
            component={Link}
            //to={url}
            sx={{
                justifyContent: "space-between",
                px: "20px",
                height: 40,
                borderRadius: 0,
                backgroundColor: isActive ? "#25252E" : undefined,
                borderRight: "2px solid",
                borderRightColor: isActive
                    ? (theme) => theme.palette.primary.main
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
