import { useState, useEffect } from "react";
import { getProfiles } from "../api/user";
import { Link } from "react-router-dom";

const UserList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const profiles = await getProfiles();
        console.log("profiles from profile", profiles);
        setProfiles(profiles);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch profiles", err);
      }
    };
    fetchProfiles();
  }, []);
  return loading ? (
    <div>
      <p>User List is loading</p>
    </div>
  ) : (
    <div>
      <ul className="divide-y divide-gray-100">
        {profiles.map((profile) => {
          return (
            <Link
              key={profile.id}
              to={`/profile/${profile.user_id}`}
            >
              <li
                key={profile.user_id}
                className="flex cursor-pointer items-center gap-2 p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex-shrink-0">
                  <img
                    src={profile.picture}
                    alt={`${profile.first_name}'s profile picture`}
                    className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                  />
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <p>
                    {profile.first_name} {profile.last_name}
                  </p>
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default UserList;
