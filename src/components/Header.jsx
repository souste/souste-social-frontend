import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex items-center justify-between border-b border-stone-200 bg-red-400 px-6 py-3 text-red-200 uppercase">
      <h1 className="text-3xl font-bold tracking-wider">Souste Social</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
        >
          Logout
        </button>
        <p className="px-4 text-sm font-semibold">
          {currentUser ? currentUser.username : "Not logged in"}
        </p>
      </div>
    </div>
  );
};

export default Header;
