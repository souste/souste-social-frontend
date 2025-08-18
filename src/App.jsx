import "./styles.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import socket from "../socket";
import { Toaster } from "react-hot-toast";

import WelcomePage from "./components/auth/WelcomePage";

import ConditionalLayout from "./components/layout/ConditionalLayout";
import TimelinePosts from "./components/posts/TimelinePosts";
import CreatePost from "./components/posts/CreatePost";
import Messages from "./components/messages/Messages";
import Notifications from "./components/notifications/Notifications";
import Profile from "./components/profile/Profile";
import UserPosts from "./components/posts/UserPosts";
import Settings from "./components/settings/Settings";

import SinglePost from "./components/posts/SinglePost";
import UpdatePost from "./components/posts/UpdatePost";
import EditProfile from "./components/profile/EditProfile";
import ProfileWrapper from "./components/profile/ProfileWrapper";
import MessagesWithUser from "./components/messages/MessagesWithUser";

import FriendsList from "./components/friendRequests/FriendsList";
import FriendSuggestionsList from "./components/friendRequests/FriendSuggestionsList";
import PendingRequestList from "./components/friendRequests/PendingRequestList";

function App() {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.id) {
      socket.emit("join", String(currentUser.id));
    }
  }, [currentUser?.id]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
      <Routes>
        <Route
          path="/signup"
          element={<WelcomePage />}
        />
        <Route
          path="/login"
          element={<WelcomePage />}
        />

        <Route
          path="/"
          element={
            currentUser ? (
              <ConditionalLayout>
                <TimelinePosts />
              </ConditionalLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/create-post"
          element={
            <ConditionalLayout>
              <CreatePost />
            </ConditionalLayout>
          }
        />
        <Route
          path="/messages"
          element={
            <ConditionalLayout>
              <Messages />
            </ConditionalLayout>
          }
        />

        <Route
          path="/notifications"
          element={
            <ConditionalLayout>
              <Notifications />
            </ConditionalLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ConditionalLayout>
              <div>
                <Profile />
                <UserPosts />
              </div>
            </ConditionalLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <ConditionalLayout>
              <Settings />
            </ConditionalLayout>
          }
        />

        <Route
          path="/posts/:postId"
          element={
            <ConditionalLayout>
              <SinglePost />
            </ConditionalLayout>
          }
        />

        <Route
          path="/posts/:postId/edit-post"
          element={
            <ConditionalLayout>
              <UpdatePost />
            </ConditionalLayout>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <ConditionalLayout>
              <EditProfile />
            </ConditionalLayout>
          }
        />
        <Route
          path="/profile/:profileId"
          element={
            <ConditionalLayout>
              <ProfileWrapper />
            </ConditionalLayout>
          }
        />

        <Route
          path="/messages/:userId/conversation/:friendId"
          element={
            <ConditionalLayout>
              <MessagesWithUser />
            </ConditionalLayout>
          }
        />

        <Route
          path="/friends"
          element={
            <ConditionalLayout>
              <FriendsList />
            </ConditionalLayout>
          }
        />

        <Route
          path="/requests"
          element={
            <ConditionalLayout>
              <PendingRequestList />
            </ConditionalLayout>
          }
        />

        <Route
          path="/suggestions"
          element={
            <ConditionalLayout>
              <FriendSuggestionsList />
            </ConditionalLayout>
          }
        />
      </Routes>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  );
}

export default App;
