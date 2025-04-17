import { useAuth } from "../context/AuthContext";
import Posts from "../components/Posts";
import FriendsPosts from "../components/FriendsPosts";
import SidebarMenu from "../components/SidebarMenu";
import FriendSuggestionsList from "../components/FriendSuggestionsList";

const HomePage = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.id;

  return (
    <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-5">
      <div className="sm:col-span-1">
        <SidebarMenu />
      </div>

      <div className="overflow-hidden rounded-lg sm:col-span-3">
        <FriendsPosts />
      </div>

      <div className="sm:col-span-1">
        <FriendSuggestionsList userId={userId} />
      </div>
    </div>
  );
};

export default HomePage;
