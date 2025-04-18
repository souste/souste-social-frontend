import { useState, useEffect } from "react";
import { getConversation } from "../api/message";
import { useNavigate, useParams } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  // const { userId, friendId } = useParams();
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = 1;
  const friendId = 4;

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
    <div>
      <h1>Markvart (hardcoded)</h1>
      <ul>
        {conversation.map((convo) => (
          <li key={convo.id}>
            <p>{convo.message}</p>
            <p>{convo.username}</p>
            <p>{formatTimestamp(convo.created_at)}</p>
          </li>
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
