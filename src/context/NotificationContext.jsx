import { useState, useEffect, createContext, useContext } from "react";
import { getUnreadNotificationCount } from "../api/notification";
import { useAuth } from "./AuthContext";
const NotificationContext = createContext();
import socket from "../../socket";

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (currentUser?.id) {
        try {
          const count = await getUnreadNotificationCount(currentUser.id);
          setUnreadCount(count);
        } catch (err) {
          console.error("Failed to fetch unread notification count", err);
        }
      }
    };
    fetchUnreadCount();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.id) return;

    const handleNotification = (notification) => {
      if (Number(notification.recipient_id) === Number(currentUser.id)) {
        setUnreadCount((prev) => prev + 1);
      }
    };
    const handleUnreadCountUpdate = (count) => {
      setUnreadCount(count);
    };

    socket.on("notification", handleNotification);
    socket.on("notification:unreadCount", handleUnreadCountUpdate);
    return () => {
      socket.off("notification", handleNotification);
      socket.off("notification:unreadCount", handleUnreadCountUpdate);
    };
  }, [currentUser]);

  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
