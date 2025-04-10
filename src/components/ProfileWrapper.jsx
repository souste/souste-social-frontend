import { useParams } from "react-router-dom";
import Profile from "./Profile";

const ProfileWrapper = () => {
  const { profileId } = useParams();
  return <Profile profileId={profileId} />;
};

export default ProfileWrapper;
