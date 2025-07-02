import { useState, useEffect, createContext, useContext } from "react";
import { getUnreadNotificationCount } from "../api/notification";
import { useAuth } from "./AuthContext";
const NotificationContext = createContext();

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
  return (
    <NotificationContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
