import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

const WelcomePage = () => {
  const [isSignupClicked, setIsSignupClicked] = useState(false);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-gray-100 md:grid-cols-[2fr_3fr]">
      <div className="flex flex-col items-center justify-center p-6">
        <div className="w-11/12 sm:w-10/12 md:w-9/12">
          {isSignupClicked ? (
            <SignUp setIsSignupClicked={setIsSignupClicked} />
          ) : (
            <Login setIsSignupClicked={setIsSignupClicked} />
          )}
        </div>
      </div>

      <div className="hidden flex-col items-center justify-center bg-white p-6 md:flex">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
          Welcome to Souste Social
        </h2>
        <p className="mb-6 max-w-md text-center text-gray-600">
          Share posts, message friends, and see updates that matter — all in one
          friendly space.
        </p>
        <img
          src="/assets/welcome-logo.png"
          alt="Souste Social"
          className="w-2/3 sm:w-2/3 md:w-1/2 lg:w-2/3"
        />
      </div>
    </div>
  );
};

export default WelcomePage;
