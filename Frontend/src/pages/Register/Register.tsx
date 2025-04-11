import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

type FormData = {
  name: string;
  email: string;
  password: string;
  address: string;
  agreeToTerms: boolean;
};

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const navigate = useNavigate();

  const { createUser } = useContext(AuthContext)

  const onSubmit = async (data: FormData) => {
    try {
      await createUser(data.email, data.password);
      toast.success("Registration successful!");
    } catch (error: any) {
      toast.error(error.message);
    }
    console.log(data);
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9] px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-md p-10 w-full max-w-md">
        <h2
          className="text-3xl font-bold text-center mb-8"
          style={{ fontFamily: "'Roboto Slab', serif" }}
        >
          Create an Account
        </h2>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            type="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            type="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            {...register("address", { required: "Address is required" })}
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-center mb-4">
          <input
            {...register("agreeToTerms", {
              required: "You must agree to the terms",
            })}
            type="checkbox"
            id="agreeToTerms"
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
            I agree to the Terms of Service
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-600">{errors.agreeToTerms.message}</p>
        )}

        {/* Register Button */}
        <button
          type="submit"
          className="cursor-pointer w-full py-2 text-white font-semibold rounded-md transition bg-gradient-to-r from-[#9537c7] to-[#3ec3ba] hover:opacity-90"
        >
          Register
        </button>

        {/* Login Link */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-[#9537c7]">
              Login
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
};

export default Register;