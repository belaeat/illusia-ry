// Admin.tsx (Responsive Layout)
import { useState, useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SideNav from "../../components/SideNav/SideNav";
import UsersList from "./UsersList";
import BookingRequests from "./BookingRequests";
import AddItems from "./AddItems";
import Dashboard from "./Dashboard";
import ManageItems from "./ManageItems";
import { AuthContext } from "../../providers/AuthProvider";

const Admin = () => {
  const { user, isUserMode, toggleUserMode } = useContext(AuthContext)!;
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (user) {
      setUserEmail(user.email || "");
    }
  }, [user]);

  if (!user) return <Navigate to="/admin/login" />;
  if (user.role !== "admin" && user.role !== "super-admin")
    return <Navigate to="/" />;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-white">
      <SideNav
        userEmail={userEmail}
        onToggleMode={toggleUserMode}
        isUserMode={isUserMode}
      />
      <main className="flex-1 p-4 md:p-8 bg-gray-50 overflow-x-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<UsersList />} />
          <Route path="/bookings" element={<BookingRequests />} />
          <Route path="/add-items" element={<AddItems />} />
          <Route path="/manage-items" element={<ManageItems />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
