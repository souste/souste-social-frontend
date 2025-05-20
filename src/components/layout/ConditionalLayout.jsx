import { useAuth } from "../../context/AuthContext";
import { useLocation, Outlet } from "react-router-dom";
import SidebarMenu from "../menu/SidebarMenu";
import FriendSuggestionsList from "../friendRequests/FriendSuggestionsList";
import PendingRequestList from "../friendRequests/PendingRequestList";
import FriendsList from "../friendRequests/FriendsList";
import Header from "../menu/Header";
import { useState } from "react";

const ConditionalLayout = ({ children }) => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userId = currentUser.id;

  const isProfilePage = location.pathname.includes("/profile");
  const isMessagesPage = location.pathname.includes("/messages");
  const isNotificationsPage = location.pathname.includes("/notifications");

  const showFriendsList =
    isProfilePage || isMessagesPage || isNotificationsPage;

  return (
    <div>
      <Header />
      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-5">
        <div className="sm:col-span-1">
          <SidebarMenu />
        </div>

        <div className="sm:col-span-3"> {children}</div>

        <div className="sm:col-span-1">
          {showFriendsList ? (
            <div>
              <PendingRequestList userId={userId} />
              <FriendsList userId={userId} />
            </div>
          ) : (
            <div>
              <PendingRequestList userId={userId} />
              <FriendSuggestionsList userId={userId} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConditionalLayout;
