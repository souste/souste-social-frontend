import { useState, createContext, useContext } from "react";
const AuthContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);
};
