import { useAuth } from "../context/AuthContext";
import CreatePost from "../components/posts/CreatePost";
import FriendSuggestionsList from "../components/friendRequests/FriendSuggestionsList";
import PendingRequestList from "../components/friendRequests/PendingRequestList";

const CreatePostPage = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.id;

  return (
    <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-4">
      <div className="overflow-hidden rounded-lg sm:col-span-3">
        <CreatePost />
      </div>

      <div className="sm:col-span-1">
        <PendingRequestList userId={userId} />
        <FriendSuggestionsList userId={userId} />
      </div>
    </div>
  );
};

export default CreatePostPage;
