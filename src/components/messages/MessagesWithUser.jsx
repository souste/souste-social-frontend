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
    const onConnect = () => console.log("Socket connected", socket.id);
    socket.on("connect", onConnect);
    return () => socket.off("connect", onConnect);
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
              className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
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
              className="rounded bg-gray-300 px-3 py-1 hover:bg-gray-400 dark:bg-stone-700 dark:text-stone-100 dark:hover:bg-stone-600"
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
        <div className="mb-2 h-4 w-32 rounded bg-stone-200 dark:bg-stone-700" />
        <div className="h-4 w-48 rounded bg-stone-200 dark:bg-stone-700" />
        <p className="mt-4 text-lg font-medium text-stone-500 dark:text-stone-400">
          Loading Conversation...
        </p>
      </div>
    </div>
  ) : (
    <div className="mx-auto min-h-screen max-w-3xl px-4 py-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/messages")}
          className="-mx-2 inline-flex items-center gap-2 rounded-md px-2 py-1 text-stone-600 transition hover:bg-stone-100 hover:text-stone-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Conversations
        </button>
      </div>

      <div className="mb-4 flex items-center gap-4 border-b border-t border-stone-200 py-4 dark:border-stone-800">
        <img
          src={profile.picture}
          alt="friend's profile picture"
          className="h-14 w-14 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
        />
        <div>
          <p className="font-semibold text-stone-800 dark:text-stone-100">
            {profile.username}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-900 dark:shadow-black/20">
        {conversation.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageCircle className="mb-4 h-16 w-16 text-stone-300 dark:text-stone-700" />
            <h3 className="mb-2 text-lg font-medium text-stone-600 dark:text-stone-300">
              No messages yet
            </h3>
            <p className="text-stone-600 dark:text-stone-400">
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
                      ? "self-end bg-blue-600 text-white dark:bg-blue-500"
                      : "self-start bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-100"
                  } max-w-[80%] break-words rounded-lg p-4 shadow-sm`}
                >
                  {editMessageId === message.id && (
                    <div>
                      <div className="mb-2 flex items-center gap-2">
                        <Edit className="h-4 w-4 text-blue-200 dark:text-blue-300" />
                        <span
                          className={`${isCurrentUser ? "text-white/70" : "text-stone-500 dark:text-stone-400"} text-xs`}
                        >
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
                        className={`font-semibold ${isCurrentUser ? "text-white" : "text-stone-900 dark:text-stone-100"}`}
                      >
                        {message.username}
                      </span>
                      <div
                        className={`text-xs ${isCurrentUser ? "text-white/70" : "text-stone-500 dark:text-stone-400"}`}
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
                          className="flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                          aria-label="Message options"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>

                        {openDropdownId === message.id && (
                          <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-stone-900 dark:ring-stone-700">
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-800"
                              onClick={() => handleEdit(message.id)}
                            >
                              <Edit className="h-4 w-4" />
                              Edit Message
                            </button>
                            <button
                              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
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

                  <p className="mt-1 whitespace-pre-wrap">{message.message}</p>
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
