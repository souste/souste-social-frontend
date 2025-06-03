import { useState, useEffect } from "react";
import { getFriends } from "../../api/friend";
import { Link } from "react-router-dom";

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

  return loading ? (
    <p className="mt-40 text-center font-semibold">
      The Friends are loading...
    </p>
  ) : (
    <div>
      <div className="mb-3 text-lg font-semibold">Friends</div>
      <ul>
        {friends.map((friend) => {
          return (
            <Link
              key={friend.id}
              to={`/profile/${friend.id}`}
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
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default FriendsList;
