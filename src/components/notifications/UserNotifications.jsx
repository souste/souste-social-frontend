import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAllNotifications,
  getUnreadNotifications,
} from "../../api/notification";

const UserNotifications = () => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const recipientId = currentUser.id;
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifications = await getAllNotifications(recipientId);
        setNotifications(notifications);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [recipientId]);

  return loading ? (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-xl font-semibold text-red-600">
          Loading Notifications...
        </p>
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">
        Your Notifications
      </h1>
      <div>
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <Link
                to={getNotificationLink(notification)}
                className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:bg-gray-50"
              >
                <img
                  src={notification.picture}
                  alt="Sender Profile"
                  className="h-12 w-12 rounded-full object-cover"
                />
                <p className="text-gray-700">{notification.message}</p>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white transition duration-200 hover:bg-red-700"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
