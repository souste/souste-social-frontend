import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, LogIn, UserPlus } from "lucide-react";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between border-b border-stone-200 bg-blue-600 px-6 py-3 text-white uppercase">
      <h1
        className="cursor-pointer text-3xl font-bold tracking-wider"
        onClick={() => navigate("/")}
      >
        Souste Social
      </h1>

      <div className="flex items-center gap-5">
        {!currentUser ? (
          <>
            <div className="flex flex-row gap-5">
              <div
                title="Login"
                onClick={() => navigate("/login")}
                className="cursor-pointer transition hover:text-blue-300"
              >
                <LogIn className="h-8 w-8" />
              </div>
              <div
                title="Signup"
                onClick={() => navigate("/signup")}
                className="cursor-pointer transition hover:text-green-300"
              >
                <UserPlus className="h-8 w-8" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              title="Logout"
              onClick={handleLogout}
              className="cursor-pointer transition hover:text-red-300"
            >
              <LogOut className="h-8 w-8" />
            </div>
            <div
              className="flex-shrink-0"
              title="Profile"
              onClick={() => navigate("/profile")}
            >
              <img
                src={currentUser.picture}
                alt={`${currentUser.username}'s profile`}
                className="h-12 w-12 cursor-pointer rounded-full border border-white object-cover transition duration-300 hover:scale-105 hover:opacity-80 hover:ring hover:ring-white"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
