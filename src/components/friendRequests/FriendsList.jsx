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
    <p className="card muted p-4 text-center text-sm">Loading friends…</p>
  ) : (
    <div className="mt-4 space-y-3">
      <div className="mb-1">
        <h3 className="relative inline-flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Friends
          <span className="chip ml-2">
            {friends.length > 99 ? "99+" : friends.length}
          </span>
        </h3>
      </div>

      {friends.length === 0 ? (
        <div className="card muted p-4 text-sm">No friends yet.</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {friends.map((friend) => {
              return (
                <Link
                  key={friend.id}
                  to={`/profile/${friend.id}`}
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-600"
                >
                  <div className="flex-shrink-0">
                    <img
                      src={friend.picture}
                      alt={`${friend.first_name}'s friend picture`}
                      className="h-10 w-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                    />
                  </div>
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    <p>
                      {friend.first_name} {friend.last_name}
                    </p>
                  </div>
                </Link>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FriendsList;
