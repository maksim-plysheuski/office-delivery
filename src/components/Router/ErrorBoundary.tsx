import { Box } from "@mui/material";
import { ErrorResponse, useRouteError } from "react-router-dom";

export const ErrorBoundary = () => {
  const error = useRouteError() as ErrorResponse;
  console.error(error);
  let errorMessage: string | number = "Error";
  if ("status" in error) {
    errorMessage = error.status + " " + error.statusText;
  }
  return <Box>{errorMessage}</Box>;
};
