import { useAuth } from "../context/AuthContext";
import Posts from "../components/Posts";
import FriendSuggestionsList from "../components/FriendSuggestionsList";

const HomePage = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.id;

  return (
    <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-5">
      <div className="sm:col-span-1">
        <p>Menu Bar</p>
      </div>

      <div className="overflow-hidden rounded-lg sm:col-span-3">
        <Posts />
      </div>

      <div className="sm:col-span-1">
        <FriendSuggestionsList userId={userId} />
      </div>
    </div>
  );
};

export default HomePage;
