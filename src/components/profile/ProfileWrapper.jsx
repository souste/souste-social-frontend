import { useParams } from "react-router-dom";
import Profile from "./Profile";
import UserPosts from "../posts/UserPosts";
import { useState } from "react";

const ProfileWrapper = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { profileId } = useParams();
  return (
    <div>
      <Profile
        profileId={profileId}
        setUserProfile={setUserProfile}
      />
      {userProfile && (
        <UserPosts
          profileId={profileId}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};

export default ProfileWrapper;
