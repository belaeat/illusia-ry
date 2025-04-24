import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Layout from "../layout/Layout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { Bookings } from "../pages/Bookings/Bookings";
import AllItems from "../pages/AllItems/AllItems";
import AddItems from "../components/Items/AddItems";
import Admin from "../pages/Admin/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      { path: "/items", element: <AllItems /> },
      { path: "/bookings", element: <Bookings /> },
      { path: "/addItems", element: <AddItems /> },
    ],
  },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

export default router;
