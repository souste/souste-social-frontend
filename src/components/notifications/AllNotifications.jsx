import { Link } from "react-router-dom";
import { MoreVertical, Trash2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const AllNotifications = ({
  allNotifications,
  getNotificationLink,
  handleDelete,
  handleMarkAsRead,
}) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

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

  return (
    <div>
      {allNotifications.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-10 text-center shadow-sm">
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div>
          <ul className="relative z-0 space-y-4 overflow-visible">
            {allNotifications.map((notification) => (
              <li
                key={notification.id}
                className={`relative flex items-center gap-4 rounded-lg border border-gray-200 p-4 shadow-sm hover:bg-gray-50 ${
                  notification.is_read ? "bg-gray-100" : "bg-white"
                }`}
              >
                {!notification.is_read && (
                  <span className="absolute top-2 left-2 h-2 w-2 rounded-full bg-blue-500"></span>
                )}
                <Link
                  to={getNotificationLink(notification)}
                  onClick={() => handleMarkAsRead(notification.id)}
                  className="flex flex-1 items-center gap-4"
                >
                  <img
                    src={notification.picture}
                    alt="Sender Profile"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <p className="text-gray-700">{notification.message}</p>
                </Link>
                <div
                  className="relative"
                  ref={(el) => (dropdownRefs.current[notification.id] = el)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setOpenDropdownId(
                        openDropdownId === notification.id
                          ? null
                          : notification.id,
                      );
                    }}
                    className="flex items-center justify-center rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {openDropdownId === notification.id && (
                    <div className="ring-opacity-5 absolute top-full right-0 z-50 mt-1 w-40 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDelete(notification.id);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Notification
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AllNotifications;
