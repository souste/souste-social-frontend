import { useState, useEffect, useRef } from "react";
import { getConversation, deleteMessage } from "../../api/message";
import { getProfile } from "../../api/user";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CreateMessage from "./CreateMessage";
import UpdateMessage from "./UpdateMessage";
import {
  Trash2,
  Edit,
  ArrowLeft,
  MessageCircle,
  MoreVertical,
} from "lucide-react";
import socket from "../../../socket";
import toast from "react-hot-toast";

const MessagesWithUser = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { userId, friendId } = useParams();
  const [conversation, setConversation] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [editMessageId, setEditMessageId] = useState(null);
  const [updatedMessageIds, setUpdatedMessageIds] = useState(new Set());
  const dropdownRefs = useRef({});

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

  useEffect(() => {
    socket.on("message", (newMessage) => {
      setConversation((prev) => [...prev, newMessage]);
    });
    return () => socket.off("message");
  }, []);

  useEffect(() => {
    console.log("Socket connected:", socket.connected);
    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideDropdown = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(event.target),
      );
      if (!clickedInsideDropdown) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (userId, messageId) => {
    toast(
      (t) => (
        <span>
          Are you sure you want to delete this message?
          <div className="mt-2 flex gap-2">
            <button
              className="rounded bg-red-600 px-3 py-1 text-white"
              onClick={async () => {
                try {
                  const success = await deleteMessage(userId, messageId);
                  if (success) {
                    const updatedConversation = await getConversation(
                      userId,
                      friendId,
                    );
                    setConversation(updatedConversation);
                    toast.success("Message Deleted");
                  }
                } catch (err) {
                  toast.error("Failed to delete messages");
                }
                toast.dismiss(t.id);
              }}
            >
              Yes
            </button>
            <button
              className="rounded bg-gray-300 px-3 py-1"
              onClick={() => {
                toast.dismiss(t.id);
                toast("Cancelled", { icon: "✖️", duration: 2000 });
              }}
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 5000 },
    );
  };

  const handleEdit = async (messageId) => {
    setEditMessageId(messageId);
    setOpenDropdownId(null);
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
          Back to Conversations
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
          <ul className="flex flex-col space-y-4">
            {conversation.map((message) => {
              const isCurrentUser = message.user_id === currentUser.id;
              return (
                <li
                  key={message.id}
                  className={`${
                    isCurrentUser
                      ? "self-end bg-blue-600 text-white"
                      : "self-start bg-gray-100 text-gray-800"
                  } relative max-w-[80%] rounded-lg p-4 shadow-md`}
                >
                  {editMessageId === message.id && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Edit className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-white">
                          Editing message
                        </span>
                      </div>
                      <UpdateMessage
                        messageId={message.id}
                        setEditMessageId={setEditMessageId}
                        setConversation={setConversation}
                        friendId={friendId}
                        setUpdatedMessageIds={setUpdatedMessageIds}
                      />
                    </div>
                  )}

                  <div className="mb-1 flex items-start justify-between">
                    <div>
                      <span
                        className={`font-semibold ${isCurrentUser ? "text-white" : "text-blue-600"}`}
                      >
                        {message.username}
                      </span>
                      <div
                        className={`text-xs ${isCurrentUser ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {updatedMessageIds.has(message.id)
                          ? `Edited: ${formatTimestamp(message.updated_at)}`
                          : formatTimestamp(message.created_at)}
                      </div>
                    </div>
                    {message.user_id === currentUser.id && (
                      <div
                        className="relative"
                        ref={(el) => (dropdownRefs.current[message.id] = el)}
                      >
                        <button
                          onClick={() =>
                            setOpenDropdownId(
                              openDropdownId === message.id ? null : message.id,
                            )
                          }
                          className="flex items-center justify-center rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        {openDropdownId === message.id && (
                          <div className="ring-opacity-5 absolute top-full right-0 z-10 mt-1 w-40 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black">
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => handleEdit(message.id)}
                            >
                              <Edit className="h-4 w-4" />
                              Edit Message
                            </button>
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                              onClick={() => {
                                handleDelete(userId, message.id);
                                setOpenDropdownId(null);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete Message
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <p className="mt-1">{message.message}</p>
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
