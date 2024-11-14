import { useAppSelector } from "@/store/hooks";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

export const Protected = ({ children }: PropsWithChildren) => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);

  return isAuth ? children : <Navigate to={"login"} />;
};
