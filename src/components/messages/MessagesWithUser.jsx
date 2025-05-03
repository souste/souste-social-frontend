import { useState, useEffect } from "react";
import { getConversation, deleteMessage } from "../../api/message";
import { getProfile } from "../../api/user";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CreateMessage from "./CreateMessage";
import UpdateMessage from "./UpdateMessage";

const MessagesWithUser = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userId, friendId } = useParams();
  const [conversation, setConversation] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [editMessageId, setEditMessageId] = useState(null);

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile(friendId);
        setProfile(profile);
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [friendId]);

  const handleDelete = async (userId, messageId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message? This action cannot be undone",
    );

    if (!confirmDelete) return;

    try {
      const success = await deleteMessage(userId, messageId);

      if (success) {
        const updatedConversation = await getConversation(userId, friendId);
        setConversation(updatedConversation);
        alert("Message deleted");
      }
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const handleEdit = async (messageId) => {
    setEditMessageId(messageId);
  };

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
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-4">
        <img
          src={profile.picture}
          alt="friend's profile picture"
          className="h-14 w-14 rounded-full object-cover"
        />

        <h1 className="text-2xl font-bold text-gray-800">{profile.username}</h1>
      </div>
      <ul className="space-y-4">
        {conversation.map((message) => (
          <li
            key={message.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                {message.username}
              </span>
              <span className="text-sm text-gray-400">
                {formatTimestamp(message.created_at)}
              </span>
            </div>
            <p className="mt-2 text-gray-800">{message.message}</p>

            {editMessageId === message.id && (
              <div className="mt-4">
                <UpdateMessage
                  messageId={message.id}
                  setEditMessageId={setEditMessageId}
                  setConversation={setConversation}
                  friendId={friendId}
                />
              </div>
            )}
            {message.user_id === currentUser.id && (
              <div className="mt-4 flex gap-3">
                <button
                  className="rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-white transition hover:bg-yellow-300"
                  onClick={() => handleEdit(message.id)}
                >
                  Edit
                </button>
                <button
                  className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-400"
                  onClick={() => {
                    handleDelete(userId, message.id);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <CreateMessage setConversation={setConversation} />
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => navigate("/messages")}
          className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default MessagesWithUser;
