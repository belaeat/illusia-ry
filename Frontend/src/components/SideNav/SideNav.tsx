import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { Switch } from "@headlessui/react";
import { FiLogOut } from "react-icons/fi";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-toastify";

const SideNav = ({
  userEmail,
  onToggleMode,
  isUserMode,
}: {
  userEmail: string;
  onToggleMode: () => void;
  isUserMode: boolean;
}) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      if (authContext) {
        // Call the backend logout endpoint to clear cookies
        await fetch("http://localhost:5001/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        // Call the Firebase logout function
        await authContext.logout();

        // Show success message
        toast.success("Logged out successfully");

        // Redirect to login page
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <div className="sticky top-0 h-screen w-64 bg-[#2E1A47] text-white flex flex-col py-6 overflow-y-auto">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Link to="/">
            <img src={logo} alt="logo" className="w-40 h-40" />
          </Link>
        </div>

        {/* User Email */}
        <div className="text-center bg-[#3EC3BA] py-2 font-semibold mb-6">
          {userEmail}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 px-6 text-sm font-semibold flex-grow">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users List</Link>
          <Link to="/admin/bookings">Booking Requests</Link>
          <Link to="/admin/add-items">Add Items</Link>
          <Link to="/admin/manage-items">Manage Items</Link>

          {isUserMode && <Link to="/admin/my-bookings">My Bookings</Link>}
        </nav>

        {/* Toggle & Footer */}
        <div className="mt-auto px-6">
          {/* Mode Toggle */}
          <div className="flex items-center justify-between mt-8 mb-4">
            <span>Switch to User Mode</span>
            <Switch
              checked={isUserMode}
              onChange={onToggleMode}
              className={`${
                isUserMode ? "bg-[#3EC3BA]" : "bg-gray-500"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${
                  isUserMode ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform bg-white rounded-full transition`}
              />
            </Switch>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mt-2 mb-4 text-red-400 hover:text-red-600 font-semibold"
          >
            <FiLogOut />
            Log Out
          </button>

          <p className="text-xs text-center">Illusia Ry @ 2025</p>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
