import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Profile from "../components/profile/Profile";
import FriendsList from "../components/friendRequests/FriendsList";
import PendingRequestList from "../components/friendRequests/PendingRequestList";
import SidebarMenu from "../components/menu/SidebarMenu";
import OwnPosts from "../components/posts/OwnPosts";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { profileId } = useParams();
  const userId = profileId || currentUser.id;

  const isCurrentUser = userId === currentUser.id;

  return (
    <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-4">
      <div className="overflow-hidden rounded-lg bg-white shadow sm:col-span-3">
        <Profile
          profileId={userId}
          viewerId={currentUser.id}
          isCurrentUser={isCurrentUser}
        />
        <OwnPosts />
      </div>

      <div className="sm:col-span-1">
        {isCurrentUser && (
          <div className="space-y-6">
            <PendingRequestList userId={userId} />
            <FriendsList userId={userId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
