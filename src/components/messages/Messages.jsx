import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getConversations } from "../../api/message";
import { ArrowLeft } from "lucide-react";

const Messages = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversations = await getConversations(userId);
        setConversations(conversations);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      }
    };
    fetchConversations();
  }, [userId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown Time";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return diffMins <= 1 ? "Just Now" : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else {
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
  };

  return loading ? (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="mb-2 h-4 w-32 rounded">
          <div className="h-4 w-48 rounded">
            <p className="mt-4 text-lg font-medium text-gray-500">
              Loading Messages...
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-gray-800"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Timeline
      </button>
      <h1 className="mb-8 text-3xl font-bold text-gray-800">Your Messages</h1>

      {conversations.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-10 text-center shadow-sm">
          <p className="text-gray-500">No messages yet</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {conversations.map((convo) => (
            <li key={convo.id}>
              <Link
                to={`/messages/${userId}/conversation/${convo.id}`}
                className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-150 hover:bg-gray-50 hover:shadow-md"
              >
                <img
                  src={convo.picture}
                  alt="users profile picture"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="mb-1 flex justify-between">
                    <p className="font-semibold text-gray-800">
                      {convo.username}
                    </p>
                    <span className="text-sm text-gray-400">
                      {formatTimestamp(convo.latest_message_time)}
                    </span>
                  </div>
                  <p className="line-clamp-1 text-sm text-gray-600">
                    {convo.latest_message}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Messages;
