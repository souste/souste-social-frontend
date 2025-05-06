import { useAuth } from "../context/AuthContext";
import FriendsPosts from "../components/posts/FriendsPosts";
import SidebarMenu from "../components/menu/SidebarMenu";
import FriendSuggestionsList from "../components/friendRequests/FriendSuggestionsList";
import PendingRequestList from "../components/friendRequests/PendingRequestList";

const HomePage = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.id;

  return (
    <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-5">
      <div className="overflow-hidden rounded-lg sm:col-span-3">
        <FriendsPosts />
      </div>

      <div className="sm:col-span-1">
        <PendingRequestList userId={userId} />
        <FriendSuggestionsList userId={userId} />
      </div>
    </div>
  );
};

export default HomePage;
