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
    <div>
      <Profile
        profileId={userId}
        viewerId={currentUser.id}
        isCurrentUser={isCurrentUser}
      />
      {isCurrentUser && (
        <div>
          <FriendsList userId={userId} />
          <PendingRequestList userId={userId} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
