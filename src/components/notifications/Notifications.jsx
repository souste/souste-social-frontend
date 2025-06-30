import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UnreadNotifications from "./UnreadNotifications";
import ReadNotifications from "./ReadNotifications";
import {
  getUnreadNotifications,
  getReadNotifications,
} from "../../api/notification";
import { ArrowLeft } from "lucide-react";

const Notifications = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const recipientId = currentUser.id;

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const unreadNotifications = await getUnreadNotifications(recipientId);
        setUnreadNotifications(unreadNotifications);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnreadNotifications();
  }, [recipientId]);

  useEffect(() => {
    const fetchReadNotifications = async () => {
      try {
        const readNotifications = await getReadNotifications(recipientId);
        setReadNotifications(readNotifications);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReadNotifications();
  }, [recipientId]);

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
      <UnreadNotifications
        unreadNotifications={unreadNotifications}
        getNotificationLink={getNotificationLink}
      />
      <ReadNotifications
        readNotifications={readNotifications}
        getNotificationLink={getNotificationLink}
      />
    </div>
  );
};

export default Notifications;
