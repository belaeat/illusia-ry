import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../providers/AuthProvider";

type LoginFormInputs = {
  email: string;
  password: string;
  remember: boolean;
};

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { signin } = authContext;

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      // First, authenticate with Firebase
      const result = await signin(data.email, data.password);
      console.log("Logged in user:", result.user);

      // Then, authenticate with our backend to get the JWT token
      const backendResponse = await fetch(
        "http://localhost:5001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        }
      );

      if (!backendResponse.ok) {
        throw new Error("Failed to authenticate with backend");
      }

      const backendData = await backendResponse.json();
      console.log("Backend response:", backendData);

      // Store the JWT token in localStorage
      if (backendData.token) {
        localStorage.setItem("token", backendData.token);
        console.log("Token stored in localStorage:", backendData.token);
      } else {
        console.error("No token found in backend response");
      }

      toast.success("Login successful!");
      navigate("/");
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
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
          Login
        </h2>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Your Email"
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
            placeholder="Your Password"
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

        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center">
            <input type="checkbox" {...register("remember")} className="mr-2" />
            Remember me
          </label>
          <a href="#" className="text-[#3ec3ba] underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full py-2 text-white font-semibold rounded-md transition bg-[#3ec3ba] hover:opacity-90"
        >
          LOGIN
        </button>

        <p className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="font-bold text-[#9537c7]">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
