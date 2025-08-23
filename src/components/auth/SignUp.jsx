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
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    setSuccess("");
    try {
      const response = await signupUser(user);
      if (response.errors) {
        setErrors(response.errors);
        setIsSubmitting(false);
        return;
      }
      setSuccess(response.message || "Account created!");
      setTimeout(() => {
        if (typeof setIsSignupClicked === "function") {
          setIsSignupClicked(false);
        } else {
          navigate("/login", {
            replace: true,
            state: {
              justSignedUp: true,
              email: user.email.trim().toLowerCase(),
            },
          });
        }
      }, 900);
    } catch (err) {
      console.error("Failed to Signup user", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <div className="w-full max-w-xl rounded-2xl border border-stone-100 bg-white p-10 shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/20">
        <h1 className="mb-6 text-center text-2xl font-bold text-stone-800 dark:text-stone-100">
          Sign Up
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

        {success && (
          <div className="mb-6 rounded-md border border-green-300 bg-green-50 p-3 text-green-800 dark:border-green-800/50 dark:bg-green-900/30 dark:text-green-300">
            {success} Please login…
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
              className="text-sm font-semibold text-stone-700 dark:text-stone-300"
            >
              First Name:
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              className="w-full rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="last_name"
              className="text-sm font-semibold text-stone-700 dark:text-stone-300"
            >
              Last Name:
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              className="w-full rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm font-semibold text-stone-700 dark:text-stone-300"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleChange}
              className="w-full rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
              required
            />
          </div>

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
              value={user.email}
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
              value={user.password}
              onChange={handleChange}
              className="w-full rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-sm text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-400"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirm_password"
              className="text-sm font-semibold text-stone-700 dark:text-stone-300"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={user.confirm_password}
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
              {isSubmitting ? "Submitting" : "Sign Up"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-stone-600 dark:text-stone-400">
          <p>Already have an account? </p>
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
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
