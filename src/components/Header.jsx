import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { currentUser } = useAuth();
  return (
    <div className="flex items-center justify-between border-b border-stone-200 bg-red-400 px-6 py-3 text-red-200 uppercase">
      <h1 className="text-3xl font-bold tracking-wider">Souste Social</h1>
      <p className="px4 text-sm font-semibold">
        {currentUser ? currentUser.username : "Not logged in"}
      </p>
    </div>
  );
};

export default Header;
