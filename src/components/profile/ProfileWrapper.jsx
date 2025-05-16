import { useParams } from "react-router-dom";
import Profile from "./Profile";
import UserPosts from "../posts/UserPosts";

const ProfileWrapper = () => {
  const { profileId } = useParams();
  return (
    <div>
      <Profile profileId={profileId} />
      <UserPosts profileId={profileId} />
    </div>
  );
};

export default ProfileWrapper;
