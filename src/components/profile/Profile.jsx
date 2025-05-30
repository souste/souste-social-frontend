import { useState, useEffect } from "react";
import { getProfile } from "../../api/user";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import FriendRequestButton from "../friendRequests/FriendRequestButton";

const Profile = ({ setUserProfile }) => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();
  const { profileId } = useParams();
  const userId = profileId || currentUser.id;

  const isCurrentUser = userId === currentUser.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile(userId);
        setProfile(profile);
        if (setUserProfile) {
          setUserProfile(profile);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [userId, setUserProfile]);

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
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="mb-2 h-4 w-32 rounded">
          <div className="h-4 w-48 rounded">
            <p className="mt-4 text-lg font-medium text-gray-500">
              Loading Profile...
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <img
                src={profile.picture}
                alt={`${profile.username}'s profile picture`}
                className="h-24 w-24 rounded-full object-cover shadow-md"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {profile.username}
                </h1>
                <p className="text-gray-600">
                  {profile.first_name} {profile.last_name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
            {isCurrentUser && (
              <button
                onClick={() => navigate("/profile/edit")}
                className="self-start rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-400"
              >
                Edit Profile
              </button>
            )}

            {!isCurrentUser && (
              <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                <FriendRequestButton friendId={profileId} />
                <button
                  onClick={() =>
                    navigate(
                      `/messages/${currentUser.id}/conversation/${profileId}`,
                    )
                  }
                  className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-400"
                >
                  Message
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 border-t pt-4">
          <h2 className="mb-1 text-lg font-medium text-gray-700">Bio:</h2>
          <p className="text-gray-600">{profile.bio || "No Bio provided"}</p>
        </div>

        <div className="mt-6 border-t pt-4 text-gray-700">
          <div className="space-y-2">
            <p>
              <strong>Occupation: </strong>{" "}
              {profile.occupation || "No Occupation provided"}
            </p>
            <p>
              <strong>Birthday: </strong>{" "}
              {formatTimestamp(profile.birth_date) || "No Birthday provided"}
            </p>
            <p>
              <strong>Location: </strong>{" "}
              {profile.location || "No Location Provided"}{" "}
            </p>
            <p>
              <strong>Joined:</strong> {formatTimestamp(profile.created_at)}
            </p>
            <p>
              <strong>
                {profile.friend_count > 1 ? "Friends:" : "Friend:"}
              </strong>{" "}
              {profile.friend_count}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
