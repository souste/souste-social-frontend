import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

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

  const handleMarkAsRead = async (notificationId) => {
    try {
      await readNotification(notificationId);
      setUnreadNotifications((prev) =>
        prev.filter((n) => n.id !== notificationId),
      );
      const all = await getAllNotifications(recipientId);
      setAllNotifications(all);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleDelete = async (notificationId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notification?",
    );
    if (!confirmDelete) return;

    try {
      const success = await deleteNotification(notificationId);

      if (success) {
        const [unread, all] = await Promise.all([
          getUnreadNotifications(recipientId),
          getAllNotifications(recipientId),
        ]);
        setUnreadNotifications(unread);
        setAllNotifications(all);
      }
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const handleDeleteAll = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete all Notifications?",
    );
    if (!confirmDelete) return;

    try {
      const success = await deleteAllNotifications(recipientId);

      if (success) {
        const [unread, all] = await Promise.all([
          getUnreadNotifications(recipientId),
          getAllNotifications(recipientId),
        ]);
        setUnreadNotifications(unread);
        setAllNotifications(all);
      }
    } catch (err) {
      console.error("Failed to delete all notification", err);
    }
  };

  const handleReadAll = async () => {
    const confirmRead = window.confirm(
      "Are you sure you want to mark all notifications as read?",
    );
    if (!confirmRead) return;

    try {
      const success = await readAllNotifications(recipientId);

      if (success) {
        const [unread, all] = await Promise.all([
          getUnreadNotifications(recipientId),
          getAllNotifications(recipientId),
        ]);
        setUnreadNotifications(unread);
        setAllNotifications(all);
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
        <div className="mb-2 h-4 w-32 rounded">
          <div className="h-4 w-48 rounded">
            <p className="mt-4 text-lg font-medium text-gray-500">
              Loading Notifications...
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-gray-800"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Timeline
      </button>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Your Notifications
      </h1>
      <div className="mb-4 flex gap-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`rounded px-4 py-2 ${
            activeTab === "all" ? "bg-gray-200 font-semibold" : "text-gray-500"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("unread")}
          className={`rounded px-4 py-2 ${
            activeTab === "unread"
              ? "bg-gray-200 font-semibold"
              : "text-gray-500"
          }`}
        >
          Unread
        </button>
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
      <div>
        <button onClick={() => handleDeleteAll()}>
          <Trash2 className="h-4 w-4" />
          Delete All Notifications
        </button>
        <button onClick={() => handleReadAll()}>
          <MailOpen className="h-4 w-4" />
          Mark All As Read
        </button>
      </div>
    </div>
  );
};

export default Notifications;
