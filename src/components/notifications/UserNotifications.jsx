import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
    <div>
      <h1>User Notifications</h1>
      <div>
        <ul>
          {notifications.map((notification) => (
            <li>
              <p>{notification.message}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-gray-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
