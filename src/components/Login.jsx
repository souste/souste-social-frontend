import { useState } from "react";
import { loginUser } from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    try {
      const response = await loginUser(loginCredentials);

      if (response.errors) {
        setErrors(response.errors);
        console.log("errors in login", response.errors);
        setIsSubmitting(false);
        return;
      }
      setCurrentUser(response.data.user);
      navigate("/");
    } catch (err) {
      console.error("Failed to login user", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Login
      </h1>
      {errors.length > 0 && (
        <div className="mb-6 bg-red-100 p-3 text-red-700">
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error.msg}</li>
            ))}
          </ul>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4"
      >
        <div className="mb-3 flex flex-col gap-2 sm:items-center">
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
            value={loginCredentials.email}
            onChange={handleChange}
            className="w-full max-w-md rounded-full border border-gray-300 bg-gray-100 px-4 py-2 focus:ring focus:ring-red-400 focus:outline-none"
            required
          />
        </div>

        <div className="mb-3 flex flex-col gap-2 sm:items-center">
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
            value={loginCredentials.password}
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
            {isSubmitting ? "Logging in" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
