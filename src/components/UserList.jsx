import { useState, useEffect } from "react";
import { getProfiles } from "../api/user";

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
    <p>User List is loading</p>
  ) : (
    <div>
      <ul>
        {profiles.map((profile) => {
          return (
            <li key={profile.user_id}>
              <img
                src={profile.picture}
                alt={`${profile.first_name}'s profile picture`}
              />
              <p>
                {profile.first_name} {profile.last_name}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserList;
