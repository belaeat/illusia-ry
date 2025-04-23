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

  let from = location.state?.from?.pathname || "/";
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { signin } = authContext;

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const result = await signin(data.email, data.password);
      console.log("Logged in user:", result.user);
      toast.success("Login successful!");
      navigate("/");
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || "Login failed");
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
          Don’t have an account?{" "}
          <Link to="/register" className="font-bold text-[#9537c7]">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
