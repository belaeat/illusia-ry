import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../providers/AuthProvider";
import axios, { AxiosError } from "axios";

type AdminLoginFormInputs = {
  email: string;
  password: string;
};

interface LocationState {
  from: {
    pathname: string;
  };
}

const AdminLogin: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormInputs>();

  const navigate = useNavigate();
  const location = useLocation();
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Loading...</div>;
  }

  const { signin, updateUserRole } = authContext;

  const onSubmit = async (data: AdminLoginFormInputs) => {
    try {
      console.log("Attempting backend login...");
      // First authenticate with your backend
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email: data.email,
          password: data.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Backend login response:", response.data);

      // Check if the user has admin role
      const userRole = response.data.user.role;
      if (userRole !== "admin" && userRole !== "super-admin") {
        console.log("User role check failed:", userRole);
        toast.error("You do not have admin privileges");
        return;
      }

      // If backend authentication succeeds and user is admin, try Firebase login
      try {
        console.log("Attempting Firebase login...");
        await signin(data.email, data.password);
        console.log("Firebase login successful");
      } catch (firebaseError) {
        console.error("Firebase login error:", firebaseError);
        // Continue even if Firebase login fails, as we already have backend authentication
      }

      // Update the user role in the auth context
      updateUserRole(userRole);
      console.log("User role updated to:", userRole);

      toast.success("Login successful!");

      // Redirect to the admin dashboard or the page they were trying to access
      const from =
        (location.state as LocationState)?.from?.pathname || "/admin";
      console.log("Redirecting to:", from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof AxiosError) {
        console.error("Axios error details:", error.response?.data);
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("Login failed");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md"
        style={{ fontFamily: "'Lato', sans-serif", color: "#2a2a2a" }}
      >
        <h2
          className="text-3xl font-bold text-center mb-8"
          style={{ fontFamily: "'Roboto Slab', serif" }}
        >
          Admin Login
        </h2>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Admin Email"
            {...register("email", { required: "Email is required" })}
            className={`w-full px-4 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]`}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <input
            type="password"
            placeholder="Admin Password"
            {...register("password", { required: "Password is required" })}
            className={`w-full px-4 py-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]`}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-[#9537c7] text-white py-2 rounded-md hover:bg-[#7a2da3] transition-colors"
        >
          Login as Admin
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
