import { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";

const WelcomePage = () => {
  const [isSignupClicked, setIsSignupClicked] = useState(false);

  return (
    <div className="grid min-h-screen grid-cols-1 bg-gray-100 md:grid-cols-[1fr_3fr]">
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          {isSignupClicked ? (
            <SignUp setIsSignupClicked={setIsSignupClicked} />
          ) : (
            <Login setIsSignupClicked={setIsSignupClicked} />
          )}
        </div>
      </div>
      <div className="hidden flex-col items-center justify-center bg-white p-6 md:flex">
        <img
          src="/assets/welcome-logo.png"
          alt="Souste Social"
          className="w-2/3 sm:w-1/2 md:w-2/5"
        />
      </div>
    </div>
  );
};

export default WelcomePage;
