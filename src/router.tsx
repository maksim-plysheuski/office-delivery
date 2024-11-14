import {
  createBrowserRouter,
} from "react-router-dom";
import {MainLayout} from "./components/MainLayout/MainLayout.tsx";
import {MapPage} from "./components/MapPage/MapPage.tsx";
import {ROUTES} from "./constants/routes.ts";



export const router = (createBrowserRouter)([
  {

    element: (
        <MainLayout />
    ),
    children: [
      { path: ROUTES.root, element: <MapPage /> },
    ],
  },
]);
