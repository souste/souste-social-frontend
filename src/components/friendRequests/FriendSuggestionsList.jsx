import { useState, useEffect } from "react";
import { getFriendSuggestions } from "../../api/friend";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const FriendSuggestionsList = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const [friendSuggestions, setFriendSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFriendSuggestions = async () => {
      try {
        const friendSuggestions = await getFriendSuggestions(userId);
        setFriendSuggestions(friendSuggestions);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch friend suggestions", err);
      }
    };
    fetchFriendSuggestions();
  }, [userId]);

  return loading ? (
    <div className="card muted p-4 text-center text-sm">
      Loading suggestions…
    </div>
  ) : (
    <div className="space-y-3">
      <h3 className="inline-flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Friend Suggestions
      </h3>

      {friendSuggestions.length === 0 ? (
        <div className="card muted p-4 text-sm">No suggestions right now.</div>
      ) : (
        <div className="card overflow-hidden p-0">
          <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {friendSuggestions.map((friendSuggestion) => {
              return (
                <li key={friendSuggestion.user_id}>
                  <Link
                    to={`/profile/${friendSuggestion.user_id}`}
                    className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-600"
                  >
                    <div className="flex-shrink-0">
                      <img
                        src={friendSuggestion.picture}
                        alt={`${friendSuggestion.first_name}'s picture`}
                        className="h-10 w-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                      />
                    </div>
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      <p>
                        {friendSuggestion.first_name}{" "}
                        {friendSuggestion.last_name}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FriendSuggestionsList;
