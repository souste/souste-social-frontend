import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getConversations, deleteConversation } from "../../api/message";
import { ArrowLeft, MoreVertical, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const Messages = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

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
  });

  const handleDelete = async (userId, friendId) => {
    toast(
      (t) => (
        <span>
          Are you sure you want to delete this conversation?
          <div className="mt-2 flex gap-2">
            <button
              className="rounded bg-red-600 px-3 py-1 text-white"
              onClick={async () => {
                try {
                  const success = await deleteConversation(userId, friendId);
                  if (success) {
                    const updatedConversations = await getConversations(
                      userId,
                      friendId,
                    );
                    setConversations(updatedConversations);
                    toast.success("Conversation Conversation");
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
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        Your Conversations
      </h1>

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
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-150 hover:bg-gray-50 hover:shadow-md"
              >
                <div className="flex flex-1 items-center gap-4">
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
                </div>
                <div
                  className="relative ml-4 shrink-0"
                  ref={(el) => (dropdownRefs.current[convo.id] = el)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setOpenDropdownId(
                        openDropdownId === convo.id ? null : convo.id,
                      );
                    }}
                    className="flex items-center justify-center rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>
                  {openDropdownId === convo.id && (
                    <div className="ring-opacity-5 absolute top-full right-0 z-50 mt-1 w-40 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDelete(userId, convo.id);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Conversation
                      </button>
                    </div>
                  )}
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
