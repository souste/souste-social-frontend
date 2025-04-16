import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Profile from "../components/Profile";
import FriendsList from "../components/FriendsList";
import PendingRequestList from "../components/PendingRequestList";

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const { profileId } = useParams();
  const userId = profileId || currentUser.id;

  const isCurrentUser = userId === currentUser.id;

  return (
    <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-5">
      <div className="sm:col-span-1">
        <p>Menu Bar</p>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow sm:col-span-3">
        <Profile
          profileId={userId}
          viewerId={currentUser.id}
          isCurrentUser={isCurrentUser}
        />
      </div>

      <div className="sm:col-span-1">
        {isCurrentUser && (
          <div className="space-y-6">
            <PendingRequestList userId={userId} />
          </div>
        )}
        <FriendsList userId={userId} />
      </div>
    </div>
  );
};

export default ProfilePage;
