import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SideNav from "../../components/SideNav/SideNav";
import UsersList from "./UsersList";
import BookingRequests from "./BookingRequests";
import AddItems from "./AddItems";
import Dashboard from "./Dashboard";
import MyBookings from "./MyBookings";
import { AuthContext } from "../../providers/AuthProvider";
import { useContext } from "react";

const Admin = () => {
  const { user, isUserMode, toggleUserMode } = useContext(AuthContext)!;
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (user) {
      setUserEmail(user.email || "");
    }
  }, [user]);

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/admin/login" />;
  }

  // Check if user has admin role
  if (user.role !== 'admin' && user.role !== 'super-admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex bg-white">
      <SideNav
        userEmail={userEmail}
        onToggleMode={toggleUserMode}
        isUserMode={isUserMode}
      />
      <div className="flex-1 p-4 md:p-8 bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/bookings" element={<BookingRequests />} />
          <Route path="/add-items" element={<AddItems />} />
          {isUserMode && <Route path="/my-bookings" element={<MyBookings />} />}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
