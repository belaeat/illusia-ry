import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import Layout from "../layout/Layout";
import ErrorPage from "../pages/ErrorPage/ErrorPage";
import { Bookings } from "../pages/Bookings/Bookings";
import AllItems from "../pages/AllItems/AllItems";
import AddItems from "../pages/Admin/AddItems";
import Admin from "../pages/Admin/Admin";
import AdminLogin from "../pages/AdminLogin/AdminLogin";
import ProtectedRoute from "../components/ProtectedRoute";
import UsersList from "../pages/Admin/UsersList";
import BookingRequests from "../pages/Admin/BookingRequests";
import MyBookings from "../pages/Admin/MyBookings";
import Cart from "../pages/Cart/Cart";


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
      { path: "/my-bookings", element: <Bookings /> },
      { path: "/cart", element: <Cart /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      { path: "add-items", element: <AddItems /> },
      { path: "users", element: <UsersList /> },
      { path: "bookings", element: <BookingRequests /> },
      { path: "my-bookings", element: <MyBookings /> },
    ],
  },
]);

export default router;
