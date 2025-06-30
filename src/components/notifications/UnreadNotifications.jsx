import { Link } from "react-router-dom";
import { readNotification } from "../../api/notification";

const UnreadNotifications = ({ unreadNotifications, getNotificationLink }) => {
  const handleClick = (notificationId) => {
    readNotification(notificationId);
  };

  return (
    <div>
      {unreadNotifications.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-10 text-center shadow-sm">
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div>
          <ul className="space-y-4">
            {unreadNotifications.map((notification) => (
              <li key={notification.id}>
                <Link
                  to={getNotificationLink(notification)}
                  onClick={() => handleClick(notification.id)}
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
        </div>
      )}
    </div>
  );
};

export default UnreadNotifications;
