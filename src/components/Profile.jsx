import { useState, useEffect } from "react";
import { getProfile } from "../api/user";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const userId = currentUser.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile(userId);
        console.log(profile.picture);
        setProfile(profile);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [userId]);
  return (
    <div>
      <img
        src={profile.picture}
        alt={`${profile.username}'s profile picture`}
      />
      <h1>{profile.username}</h1>
      <p>
        {profile.first_name} {profile.last_name}
      </p>
      <p>Bio {profile.bio}</p>
      <p>Occupation {profile.occupation}</p>
      <p>Location: {profile.location} </p>
      <p>Friend Count: {profile.friend_count}</p>
    </div>
  );
};

export default Profile;
