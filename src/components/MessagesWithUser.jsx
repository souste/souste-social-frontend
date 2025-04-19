import { useState, useEffect } from "react";
import { getConversation } from "../api/message";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const MessagesWithUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, friendId } = useParams();
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = location.state?.username || "Unknown User";
  const picture = location.state?.picture || "No User Pic";

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const conversation = await getConversation(userId, friendId);
        setConversation(conversation);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch conversation", err);
      }
    };
    fetchConversation();
  }, [userId, friendId]);

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
    <div className="space-y-4 px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800">{username}</h1>
      <img
        src={picture}
        alt="friend's profile picture"
      />
      <ul className="space-y-4">
        {conversation.map((convo) => (
          <li
            key={convo.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-md"
          >
            <div className="text-lg font-medium text-gray-900">
              {convo.username}
            </div>
            <p className="mt-2 text-gray-800">{convo.message}</p>

            <p className="mt-2 text-gray-800">
              {formatTimestamp(convo.created_at)}
            </p>
          </li>
        ))}
      </ul>
      <button
        onClick={() => navigate("/messages")}
        className="rounded-full border bg-red-300 px-3 py-3 font-semibold text-white hover:bg-red-200"
      >
        Back
      </button>
    </div>
  );
};

export default MessagesWithUser;
