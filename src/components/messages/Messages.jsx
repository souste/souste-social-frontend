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
    <div>
      <h1>Messages</h1>
      <ul>
        {conversations.map((convo) => (
          <Link
            key={convo.id}
            to={`/messages/${userId}/conversation/${convo.id}`}
          >
            <div>{convo.username}</div>
            <img
              src={convo.picture}
              alt="users profile picture"
            />
            <div>{convo.latest_message}</div>
            <div>{formatTimestamp(convo.latest_message_time)}</div>
          </Link>
        ))}
      </ul>
      <button
        onClick={() => navigate("/")}
        className="rounded-full border bg-red-300 px-3 py-3 font-semibold text-white hover:bg-red-200"
      >
        Back
      </button>
    </div>
  );
};

export default Messages;
