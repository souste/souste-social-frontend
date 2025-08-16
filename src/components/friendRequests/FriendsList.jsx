import { useState, useEffect } from "react";
import { getFriends } from "../../api/friend";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const FriendsList = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.id;
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
    <p className="rounded-xl bg-white p-4 text-center text-sm text-stone-500 shadow-sm">
      Loading Friends...
    </p>
  ) : (
    <div className="mt-4">
      <div className="mb-3">
        <h3 className="relative inline-block text-lg font-semibold text-stone-800">
          Friends
          <span className="absolute left-full top-0 ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-stone-100 text-xs font-semibold text-stone-700 ring-1 ring-stone-200">
            {friends.length > 99 ? "99+" : friends.length}
          </span>
        </h3>
      </div>

      {friends.length === 0 ? (
        <div className="rounded-xl bg-white p-4 text-sm text-stone-500 shadow-sm">
          No friends yet.
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default FriendsList;
