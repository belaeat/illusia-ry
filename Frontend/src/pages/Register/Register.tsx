import { useState } from "react";
import { Link } from "react-router";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    agree: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f9f9f9] px-4">
      <form
        onSubmit={handleSubmit}
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
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]"
        />

        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]"
        />

        <input
          type="text"
          name="address"
          placeholder="Your Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9537c7]"
        />
        <div className="flex items-start mb-6">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="mr-2 mt-1"
          />
          <label className="text-sm">
            I agree all statements in{" "}
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
          <Link to="/login">
            <p className="font-bold text-[#9537c7] underline">Login</p>
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
