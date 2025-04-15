import { useState, useEffect } from "react";
import { getFriends } from "../api/friend";

const FriendsList = ({ userId }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const friends = await getFriends(userId);
        setFriends(friends);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch friends", err);
      }
    };
    fetchFriends();
  }, [userId]);

  return (
    <div>
      <h1>Friends List</h1>
      <ul>
        {friends.map((friend) => {
          return (
            <li
              key={friend.id}
              className="flex cursor-pointer items-center gap-2 p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                <img
                  src={friend.picture}
                  alt={`${friend.first_name}'s friend picture`}
                  className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                />
              </div>
              <div className="text-sm font-medium text-gray-900">
                <p>
                  {friend.first_name} {friend.last_name}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FriendsList;
