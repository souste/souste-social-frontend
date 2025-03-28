import { useState } from "react";
import { createUser } from "../api";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await createUser(user);

      if (response.errors) {
        setErrors(response.errors);
        setIsSubmitting(false);
        return;
      }

      console.log(errors);

      navigate("/");
    } catch (err) {
      console.error("Failed to create user", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Sign Up
      </h1>
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="mb-5 flex flex-col gap-2 sm:items-center">
          <label
            htmlFor="first_name"
            className="text-sm font-semibold text-gray-700"
          >
            First Name:
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={user.first_name}
            onChange={handleChange}
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:items-center">
          <label
            htmlFor="last_name"
            className="text-sm font-semibold text-gray-700"
          >
            Last Name:
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={user.last_name}
            onChange={handleChange}
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:items-center">
          <label
            htmlFor="username"
            className="text-sm font-semibold text-gray-700"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:items-center">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-gray-700"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:items-center">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-gray-700"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
            required
          />
        </div>

        <div className="mb-5 flex flex-col gap-2 sm:items-center">
          <label
            htmlFor="confirm_password"
            className="text-sm font-semibold text-gray-700"
          >
            Confirm Password:
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={user.confirm_password}
            onChange={handleChange}
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
            required
          />
        </div>
        <div className="flex flex-col sm:items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full max-w-md rounded-full bg-red-500 py-3 font-semibold text-white uppercase transition hover:bg-red-400"
          >
            {isSubmitting ? "Submitting" : "Sign Up"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
