import { useState } from "react";
import { signupUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUp = ({ setIsSignupClicked }) => {
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
    setErrors([]);
    try {
      const response = await signupUser(user);

      if (response.errors) {
        setErrors(response.errors);
        setIsSubmitting(false);
        return;
      }

      navigate("/login");
    } catch (err) {
      console.error("Failed to Signup user", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Sign Up
        </h1>
        {errors.length > 0 && (
          <div className="mb-6 rounded-md border border-red-300 bg-red-100 p-3 text-red-700">
            <ul className="list-inside list-disc">
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
          <div className="flex flex-col gap-2">
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
              className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
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
              className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
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
              className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
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
              className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
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
              className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
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
              className="w-full rounded-full border border-gray-300 bg-gray-100 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full cursor-pointer rounded-full bg-blue-600 py-3 font-semibold text-white uppercase transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isSubmitting ? "Submitting" : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Already have an account? </p>
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline"
            onClick={() => setIsSignupClicked(false)}
          >
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
