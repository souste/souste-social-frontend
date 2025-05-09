import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between border-b border-stone-200 bg-blue-600 px-6 py-3 text-white uppercase">
      <h1 className="text-3xl font-bold tracking-wider">Souste Social</h1>
      <div className="flex items-center gap-4">
        {currentUser ? (
          <div>
            <img
              src="../../assets/logout.png"
              alt="Logout"
              onClick={handleLogout}
              className="h-8 w-8 cursor-pointer hover:h-10 hover:w-10"
            />
          </div>
        ) : (
          <div className="flex flex-row gap-5">
            {/* <button
              onClick={() => navigate("/login")}
              className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
            >
              Login
            </button> */}
            <img
              src="../../assets/login.png"
              alt="Login"
              onClick={() => navigate("/login")}
              className="h-8 w-8 cursor-pointer hover:h-10 hover:w-10"
            />
            <img
              src="../../assets/signup.png"
              alt="Signup"
              onClick={() => navigate("/signup")}
              className="h-8 w-8 cursor-pointer hover:h-10 hover:w-10"
            />
            {/* <button
              onClick={() => navigate("/signup")}
              className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
            >
              Signup
            </button> */}
          </div>
        )}

        {currentUser && (
          <div className="flex-shrink-0">
            <img
              src={currentUser.picture}
              alt={`${currentUser.username}'s profile`}
              className="h-12 w-12 cursor-pointer rounded-full border border-black object-cover transition duration-300 hover:scale-105 hover:opacity-80 hover:ring hover:ring-white"
              onClick={() => navigate("/profile")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
