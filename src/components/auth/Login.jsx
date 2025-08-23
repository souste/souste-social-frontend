import { useState } from "react";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Login = ({ setIsSignupClicked }) => {
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
    setLoginCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    try {
      const response = await loginUser(loginCredentials);
      if (response.errors) {
        setErrors(response.errors);
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

  const handleGuestLogin = async () => {
    setIsSubmitting(true);
    setErrors([]);
    try {
      const guestCredentials = {
        email: "anon@outlook.com",
        password: "woof123",
      };
      const response = await loginUser(guestCredentials);
      if (response.errors) {
        setErrors(response.errors);
        setIsSubmitting(false);
        return;
      }
      setCurrentUser(response.data.user);
      navigate("/");
    } catch (err) {
      console.error("Failed to login as guest", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="w-full max-w-md rounded-2xl border border-stone-100 bg-white p-10 shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/20">
        <h1 className="mb-6 text-center text-2xl font-bold text-stone-800 dark:text-stone-100">
          Login
        </h1>

        {errors.length > 0 && (
          <div className="mb-6 rounded-md border border-red-300 bg-red-100 p-3 text-red-700 dark:border-red-700/50 dark:bg-red-950/40 dark:text-red-300">
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
              htmlFor="email"
              className="text-sm font-semibold text-stone-700 dark:text-stone-300"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginCredentials.email}
              onChange={handleChange}
              className="w-full rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-stone-700 dark:text-stone-300"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginCredentials.password}
              onChange={handleChange}
              className="w-full rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
              required
            />
          </div>

          <div className="flex flex-col sm:items-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 w-full rounded-full bg-blue-600 py-3 font-semibold uppercase text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-blue-300 dark:focus-visible:ring-offset-stone-900"
            >
              {isSubmitting ? "Logging in" : "Login"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleGuestLogin}
            disabled={isSubmitting}
            className="w-full rounded-full bg-stone-600 py-3 font-semibold uppercase text-white shadow-sm transition hover:bg-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:bg-stone-400 dark:bg-stone-700 dark:hover:bg-stone-600 dark:focus-visible:ring-stone-500 dark:focus-visible:ring-offset-stone-900"
          >
            {isSubmitting ? "Loading..." : "View as Guest"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
          <p>Don't have an account? </p>
          <Link
            to="/signup"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            onClick={() => setIsSignupClicked(true)}
          >
            Sign up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
