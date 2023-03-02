import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { CountryInfo } from "../pages/CountryInfo";
import { Home } from "../pages/Home";

export const router = createBrowserRouter([
   {
      path: "/",
      element: <App />,
      children: [
         {
            path: "/",
            element: <Home />,
         }, {
            path: "/country/:countryName",
            element: <CountryInfo />,
         },
      ],
   },
]);