import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
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
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(true)} />

      <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-5">
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out sm:static sm:translate-x-0 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarMenu setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        {isSidebarOpen && (
          <div
            className="bg-opacity-40 fixed inset-0 z-30 bg-black sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

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
