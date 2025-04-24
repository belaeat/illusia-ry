import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { Switch } from "@headlessui/react";
import { FiLogOut } from "react-icons/fi";

const SideNav = ({
  userEmail,
  onToggleMode,
  isUserMode,
}: {
  userEmail: string;
  onToggleMode: (value: boolean) => void;
  isUserMode: boolean;
}) => {
  return (
    <div className="min-h-screen w-64 bg-[#2E1A47] text-white flex flex-col justify-between py-6">
      <div>
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
        <nav className="flex flex-col gap-4 px-6 text-sm font-semibold">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/users">Users List</Link>
          <Link to="/admin/bookings">Booking Requests</Link>

          {isUserMode && <Link to="/admin/my-bookings">My Bookings</Link>}
        </nav>
      </div>

      {/* Toggle & Footer */}
      <div className="px-6">
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
        <button className="flex items-center gap-2 mt-2 mb-4 text-red-400 hover:text-red-600 font-semibold">
          <FiLogOut />
          Log Out
        </button>

        <p className="text-xs text-center">Illusia Ry @ 2025</p>
      </div>
    </div>
  );
};

export default SideNav;
