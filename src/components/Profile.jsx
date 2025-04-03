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

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown Time";
    const date = new Date(timestamp);

    const day = date.getDate();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];

    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return loading ? (
    <p>Profile is Loading...</p>
  ) : (
    <div className="mx-auto mt-8 max-w-2xl px-4">
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <img
              src={profile.picture}
              alt={`${profile.username}'s profile picture`}
              className="h-24 w-24 rounded-full object-cover"
            />
          </div>
        </div>
        <div className="flex-1 sm:ml-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {profile.username}
          </h1>
          <p className="text-lg text-gray-600">
            {profile.first_name} {profile.last_name}
          </p>
        </div>
        <div className="mt-4 mb-4">
          <h2 className="mb-2 text-lg font-medium text-gray-700">Bio:</h2>
          <p className="text-gray-600">{profile.bio || "No bio provided"}</p>
        </div>
        <div className="flex flex-col gap-3 text-gray-600">
          <p>
            <strong>Occupation: </strong> {profile.occupation}
          </p>
          <p>
            <strong>Location: </strong> {profile.location}{" "}
          </p>
          <p>
            <strong>Joined:</strong> {formatTimestamp(profile.created_at)}
          </p>
          <p>
            <strong>{profile.friend_count} </strong> Friends
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
