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
    <div className="space-y-4 px-4 py-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        {profile.username}
      </h1>
      <img
        src={profile.picture}
        alt="friend's profile picture"
      />
      <ul className="space-y-4">
        {conversation.map((message) => (
          <li
            key={message.id}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-md"
          >
            <div className="text-lg font-medium text-gray-900">
              {message.username}
            </div>
            <p className="mt-2 text-gray-800">{message.message}</p>

            <p className="mt-2 text-gray-800">
              {formatTimestamp(message.created_at)}
            </p>
            {editMessageId === message.id && (
              <UpdateMessage
                messageId={message.id}
                setEditMessageId={setEditMessageId}
                setConversation={setConversation}
                friendId={friendId}
              />
            )}
            {message.user_id === currentUser.id && (
              <div>
                <button
                  className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-red-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
                  onClick={() => handleEdit(message.id)}
                >
                  Edit
                </button>
                <button
                  className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-red-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
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
      <CreateMessage setConversation={setConversation} />
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
