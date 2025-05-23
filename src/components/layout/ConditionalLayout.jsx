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
      <div className="fixed top-0 z-50 w-full bg-white shadow-md">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
      </div>

      <div className="mx-auto mt-16 flex h-[calc(100vh-4rem)] max-w-7xl flex-grow flex-col gap-6 px-4 sm:grid sm:grid-cols-5">
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white pt-20 shadow-lg transition-transform duration-300 ease-in-out sm:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarMenu setIsSidebarOpen={setIsSidebarOpen} />
        </div>

        <div className="hidden h-[calc(100vh-4rem)] overflow-hidden sm:col-span-1 sm:block">
          <SidebarMenu />
        </div>

        <div className="overflow-y-auto pr-2 sm:col-span-3"> {children}</div>

        <div className="hidden sm:col-span-1 sm:block">
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 h-[calc(100vh-4rem)] overflow-y-auto pt-4 pr-2">
            {showFriendsList ? (
              <div className="space-y-4">
                <PendingRequestList userId={userId} />
                <FriendsList userId={userId} />
              </div>
            ) : (
              <div className="space-y-4">
                <PendingRequestList userId={userId} />
                <FriendSuggestionsList userId={userId} />
              </div>
            )}
          </div>
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="bg-opacity-40 fixed inset-0 z-30 bg-black sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ConditionalLayout;
