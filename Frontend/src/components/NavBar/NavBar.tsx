import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-toastify";
import CartIcon from "../CartIcon/CartIcon";

const NavBar: React.FC = () => {
  const context = useContext(AuthContext);

  if (!context) {
    return null; // or some fallback UI
  }

  const { user, logout } = context;

  const handleLogout = () => {
    logout()
      .then(() => {
        console.log("User logged out");
        toast.success("Logout successful!");
      })
      .catch((error: Error) => console.error("Logout error:", error));
  };

  // Check if user has admin role (regardless of user mode)
  const hasAdminRole = user && (user.role === 'admin' || user.role === 'super-admin');

  return (
    <div className="navbar bg-white shadow-sm">
      <div className="navbar-start">
        <Link to="/">
          <img src={logo} alt="logo" className="w-20 h-20" />
        </Link>
      </div>

      <div className="navbar-center lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className="text-[#3EC3BA] font-bold">
              Home
            </Link>
          </li>
          <li>
            <Link to="/items" className="text-[#3EC3BA] font-bold">
              Items
            </Link>
          </li>
          <li>
            <Link to="/my-bookings" className="text-[#3EC3BA] font-bold">
              My Bookings
            </Link>
          </li>
          {hasAdminRole && (
            <li>
              <Link to="/admin" className="text-[#3EC3BA] font-bold">
                Admin Panel
              </Link>
            </li>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-4">
        <CartIcon />

        {user ? (
          <button
            onClick={handleLogout}
            className="btn cursor-pointer py-2 text-white font-semibold rounded-md transition bg-[#3EC3BA] hover:opacity-90 border-none"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="btn cursor-pointer py-2 text-white font-semibold rounded-md transition bg-[#3EC3BA] hover:opacity-90 border-none"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn cursor-pointer py-2 text-white font-semibold rounded-md transition bg-[#3EC3BA] hover:opacity-90 border-none"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
