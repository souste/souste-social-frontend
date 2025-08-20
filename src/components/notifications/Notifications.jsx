import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import UnreadNotifications from "./UnreadNotifications";
import AllNotifications from "./AllNotifications";
import {
  getUnreadNotifications,
  getAllNotifications,
  deleteNotification,
  readNotification,
  deleteAllNotifications,
  readAllNotifications,
} from "../../api/notification";
import { ArrowLeft, Trash2, MailOpen, MoreVertical } from "lucide-react";
import socket from "../../../socket";
import toast from "react-hot-toast";

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { setUnreadCount } = useNotification();
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const dropdownRef = useRef({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const recipientId = currentUser.id;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const [unread, all] = await Promise.all([
          getUnreadNotifications(recipientId),
          getAllNotifications(recipientId),
        ]);
        setUnreadNotifications(unread);
        setAllNotifications(all);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    if (recipientId) fetchNotifications();
  }, [recipientId]);

  useEffect(() => {
    const handleNotification = (notification) => {
      setUnreadNotifications((prev) =>
        prev.some((n) => n.id === notification.id)
          ? prev
          : [notification, ...prev],
      );
      setAllNotifications((prev) =>
        prev.some((n) => n.id === notification.id)
          ? prev
          : [notification, ...prev],
      );
    };
    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      const res = await readNotification(notificationId);

      if (res && res.success) {
        setUnreadNotifications((prev) =>
          prev.filter((n) => n.id !== notificationId),
        );

        const all = await getAllNotifications(recipientId);
        setAllNotifications(all);

        if (typeof res.unreadCount === "number") {
          setUnreadCount(res.unreadCount);
        }
      } else {
        console.error("Failed to mark notification as read", res?.error);
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleDelete = async (notificationId) => {
    toast(
      (t) => (
        <span>
          Are you sure you want to delete this notification?
          <div className="mt-2 flex gap-2">
            <button
              className="rounded bg-red-600 px-3 py-1 text-white"
              onClick={async () => {
                try {
                  const res = await deleteNotification(notificationId);

                  if (res && res.success) {
                    setUnreadNotifications((prev) => {
                      const updated = prev.filter(
                        (n) => Number(n.id) !== Number(notificationId),
                      );
                      return updated;
                    });

                    setAllNotifications((prev) => {
                      const updated = prev.filter(
                        (n) => Number(n.id) !== Number(notificationId),
                      );
                      return updated;
                    });

                    if (typeof res.unreadCount === "number") {
                      setUnreadCount(res.unreadCount);
                    }
                    toast.success("Notification Deleted");
                  } else {
                    toast.error(res.error || "Failed to delete notificiation");
                  }
                } catch (err) {
                  toast.error("Failed to delete notification");
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

  const handleDeleteAll = async () => {
    toast(
      (t) => (
        <span>
          Are you sure you want to delete all notifications?
          <div className="mt-2 flex gap-2">
            <button
              className="rounded bg-red-600 px-3 py-1 text-white"
              onClick={async () => {
                try {
                  const res = await deleteAllNotifications(recipientId);
                  if (res && res.success) {
                    const [unread, all] = await Promise.all([
                      getUnreadNotifications(recipientId),
                      getAllNotifications(recipientId),
                    ]);
                    setUnreadNotifications(unread);
                    setAllNotifications(all);

                    if (typeof res.unreadCount === "number") {
                      setUnreadCount(res.unreadCount);
                    }

                    toast.success("All Notifications Deleted");
                  }
                } catch (err) {
                  toast.error("Failed to delete all notification");
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

  const handleReadAll = async () => {
    const confirmRead = window.confirm(
      "Are you sure you want to mark all notifications as read?",
    );
    if (!confirmRead) return;

    try {
      const res = await readAllNotifications(recipientId);

      if (res && res.success) {
        setUnreadNotifications([]);
        setAllNotifications(res.notifications);

        if (typeof res.unreadCount === "number") {
          setUnreadCount(res.unreadCount);
        }
      } else {
        console.error("Failed to mark notification as read", res?.error);
      }
    } catch (err) {
      console.error("Failed to read all notifications", err);
    }
  };

  const getNotificationLink = (notification) => {
    const { type, reference_id, sender_id } = notification;
    switch (type) {
      case "post":
      case "like_post":
        return `/posts/${reference_id}`;
      case "comment":
      case "like_comment":
        return `/posts/${reference_id}`;
      case "message":
        return `/messages/${currentUser.id}/conversation/${sender_id}`;
      case "friend_request":
      case "friend_accept":
        return `/profile/${reference_id}`;
      default:
        return "/";
    }
  };

  return loading ? (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="mb-2 h-4 w-32 rounded bg-stone-200 dark:bg-stone-700" />
        <div className="h-4 w-48 rounded bg-stone-200 dark:bg-stone-700" />
        <p className="mt-4 text-lg font-medium text-stone-500 dark:text-stone-400">
          Loading Notifications...
        </p>
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-gray-800 dark:text-stone-300 dark:hover:text-stone-100"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Timeline
      </button>

      <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-stone-100">
        Your Notifications
      </h1>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("all")}
            className={`rounded-md px-4 py-2 transition ${
              activeTab === "all"
                ? "bg-gray-200 font-semibold text-gray-900 dark:bg-stone-800 dark:text-stone-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-stone-400 dark:hover:bg-stone-800"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`rounded-md px-4 py-2 transition ${
              activeTab === "unread"
                ? "bg-gray-200 font-semibold text-gray-900 dark:bg-stone-800 dark:text-stone-100"
                : "text-gray-600 hover:bg-gray-100 dark:text-stone-400 dark:hover:bg-stone-800"
            }`}
          >
            Unread
          </button>
        </div>

        <div
          className="relative"
          ref={dropdownRef}
        >
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <MoreVertical className="h-5 w-5" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-2 top-full z-10 mt-1 w-44 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-stone-900 dark:ring-stone-700">
              <button
                onClick={() => handleReadAll()}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-stone-200 dark:hover:bg-stone-800"
              >
                <MailOpen className="h-4 w-4" />
                Mark All As Read
              </button>

              <button
                onClick={() => handleDeleteAll()}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-stone-800"
              >
                <Trash2 className="h-4 w-4" />
                Delete All Notifications
              </button>
            </div>
          )}
        </div>
      </div>

      {activeTab === "unread" ? (
        <UnreadNotifications
          unreadNotifications={unreadNotifications}
          getNotificationLink={getNotificationLink}
          handleDelete={handleDelete}
          handleMarkAsRead={handleMarkAsRead}
        />
      ) : (
        <AllNotifications
          allNotifications={allNotifications}
          getNotificationLink={getNotificationLink}
          handleDelete={handleDelete}
          handleMarkAsRead={handleMarkAsRead}
        />
      )}
    </div>
  );
};

export default Notifications;
