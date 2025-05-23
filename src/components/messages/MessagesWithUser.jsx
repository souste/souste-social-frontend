import { useState, useEffect } from "react";
import { getConversation, deleteMessage } from "../../api/message";
import { getProfile } from "../../api/user";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CreateMessage from "./CreateMessage";
import UpdateMessage from "./UpdateMessage";
import { Trash2, Edit, ArrowLeft, MessageCircle } from "lucide-react";

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
              Loading Conversation...
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="mx-auto min-h-screen max-w-3xl bg-gray-50 px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/messages")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Messages
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4 border-t border-b border-gray-200 py-4">
        <img
          src={profile.picture}
          alt="friend's profile picture"
          className="h-14 w-14 rounded-full border-2 border-gray-300 object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{profile.username}</p>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium text-gray-600">
              No messages yet
            </h3>
            <p className="text-gray-500">
              Start the conversation with {profile.username || "your friend"}!
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {conversation.map((message) => {
              const isCurrentUser = message.user_id === currentUser.id;
              return (
                <li
                  key={message.id}
                  className={`${
                    isCurrentUser
                      ? "bg-blue-300 text-white"
                      : "bg-gray-100 text-gray-800"
                  } relative max-w-[80%] rounded-lg p-4 shadow-md`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`font-semibold ${isCurrentUser ? "text-blue-50" : "text-blue-600"}`}
                    >
                      {message.username}
                    </span>
                    <span
                      className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}
                    >
                      {formatTimestamp(message.created_at)}
                    </span>
                  </div>
                  <p className="mt-1">{message.message}</p>

                  {editMessageId === message.id && (
                    <div className="mt-4 rounded bg-white p-3 shadow-inner">
                      <UpdateMessage
                        messageId={message.id}
                        setEditMessageId={setEditMessageId}
                        setConversation={setConversation}
                        friendId={friendId}
                      />
                    </div>
                  )}
                  {message.user_id === currentUser.id && (
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        className="flex items-center gap-1 text-blue-50 transition hover:text-white"
                        onClick={() => handleEdit(message.id)}
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        className="flex items-center gap-1 text-blue-50 transition hover:text-white"
                        onClick={() => {
                          handleDelete(userId, message.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="mt-8">
        <CreateMessage setConversation={setConversation} />
      </div>
    </div>
  );
};

export default MessagesWithUser;
