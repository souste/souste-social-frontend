import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, LogIn, UserPlus, Menu } from "lucide-react";

const Header = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex h-16 items-center justify-between border-b border-stone-200 bg-blue-700 px-6 text-white shadow-md">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="focus:outline-none sm:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-7 w-7 text-white" />
        </button>

        <img
          src="/assets/logo.png"
          alt="Souste Social"
          className="h-25 w-auto cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

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
