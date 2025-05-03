import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getConversations } from "../../api/message";

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
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return loading ? (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-xl font-semibold text-red-600">
          Loading Conversation...
        </p>
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Messages</h1>
      <ul className="space-y-4">
        {conversations.map((convo) => (
          <li key={convo.id}>
            <Link
              to={`/messages/${userId}/conversation/${convo.id}`}
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-gray-50"
            >
              <img
                src={convo.picture}
                alt="users profile picture"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{convo.username}</p>
                <p className="line-clamp-1 text-gray-600">
                  {convo.latest_message}
                </p>
                <p className="text-sm text-gray-400">
                  {formatTimestamp(convo.latest_message_time)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex justify-center">
        <button
          onClick={() => navigate("/")}
          className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition duration-200 hover:bg-red-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Messages;
