import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { LeftAside } from "./LeftAside";

export const MainLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        gap: 2,
        p: 2,
        pr: 0,
      }}
    >
        <LeftAside />
      <Stack
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "auto",
        }}
      >
        <Outlet />
      </Stack>
    </Box>
  );
};
