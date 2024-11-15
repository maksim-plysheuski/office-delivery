import {
  createBrowserRouter,
} from "react-router-dom";
import {MainLayout} from "./components/MainLayout/MainLayout.tsx";
import {MapPage} from "./components/MapPage/MapPage.tsx";
import {ROUTES} from "./constants/routes.ts";
import {PlacesPage} from "./components/Places/PlacesPage.tsx";
import {LoginPage} from "./components/LoginPage/LoginPage.tsx";



export const router = (createBrowserRouter)([
  {
    element: (
        <MainLayout />
    ),
    children: [
      { path: ROUTES.map, element: <MapPage /> },
      { path: ROUTES.places, element: <PlacesPage/> },
      { path: ROUTES.users, element: <h2>Раздел в разработке</h2> },
      { path: ROUTES.history, element: <h2>Раздел в разработке</h2> },
    ],
  },
  { path: ROUTES.root, element: <LoginPage/> },
]);
