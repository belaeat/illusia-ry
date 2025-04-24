import { useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { toast } from "react-toastify";
import axios from "axios";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  agree: boolean;
};

const Register = () => {
  const {
    register,
    handleSubmit,
  } = useForm<RegisterFormInputs>();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    return <p>Loading...</p>; // or handle null case more gracefully
  }

  const { createUser } = authContext;

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    console.log(data);
    try {
      const result = await createUser(data.email, data.password);
      console.log("User created:", result);
      const res = await axios.post("http://localhost:5000/api/auth/register",
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          password: data.password,
        }
        , {
        withCredentials: true, // send cookies (JWT)
      });
      console.log("User registered:", res.data);
     
      toast.success("User created successfully!");
    } catch (error: any) {
      console.error("Error creating user:", error.message);
      toast.error(error.message || "User creation failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9] px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-md p-10 w-full max-w-lg"
        style={{ fontFamily: '"Lato", sans-serif', color: "#2a2a2a" }}
      >
        <h2
          className="text-3xl font-bold text-center mb-8"
          style={{ fontFamily: '"Roboto Slab", serif' }}
        >
          Create an Account
        </h2>

        <input
          type="text"
          {...register("name", { required: "Name is required" })}
          placeholder="Your Name"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]"
        />

        <input
          type="email"
          {...register("email", { required: "Email is required" })}
          placeholder="Your Email"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]"
        />

        <input
          type="password"
          {...register("password", { required: "Password is required" })}
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]"
        />

        <input
          type="tel"
          {...register("phone")}
          placeholder="Your Phone Number"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]"
        />

        <input
          type="text"
          {...register("address")}
          placeholder="Your Address"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]"
        />

        <div className="flex items-start mb-6">
          <input
            type="checkbox"
            {...register("agree", { required: "You must agree to the terms" })}
            className="mr-2 mt-1"
          />
          <label className="text-sm">
            I agree to all statements in{" "}
            <a href="#" className="text-[#3ec3ba] underline">
              Terms of service
            </a>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white font-semibold rounded-md transition bg-[#3EC3BA] hover:opacity-90"
        >
          SIGN UP
        </button>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#9537c7] underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;