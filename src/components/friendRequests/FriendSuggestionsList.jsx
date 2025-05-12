import { useState, useEffect } from "react";
import { getFriendSuggestions } from "../../api/friend";
import { Link } from "react-router-dom";

const FriendSuggestionsList = ({ userId }) => {
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
    <div>
      <p>Friend Suggestions are loading</p>
    </div>
  ) : (
    <div>
      <div className="mb-3 text-lg font-semibold">Friend Suggestions</div>
      <ul className="divide-y divide-gray-100">
        {friendSuggestions.map((friendSuggestion) => {
          return (
            <li className="transition-colors hover:bg-gray-50">
              <Link
                key={friendSuggestion.user_id}
                to={`/profile/${friendSuggestion.user_id}`}
                className="flex cursor-pointer items-center gap-2 p-4"
              >
                <div className="flex-shrink-0">
                  <img
                    src={friendSuggestion.picture}
                    alt={`${friendSuggestion.first_name}'s picture`}
                    className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                  />
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <p>
                    {friendSuggestion.first_name} {friendSuggestion.last_name}
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FriendSuggestionsList;
