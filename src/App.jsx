import "./styles.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";

import ConditionalLayout from "./components/layout/ConditionalLayout";
import TimelinePosts from "./components/posts/TimelinePosts";
import CreatePost from "./components/posts/CreatePost";
import Messages from "./components/messages/Messages";
import UserNotifications from "./components/notifications/UserNotifications";
import Profile from "./components/profile/Profile";
import UserPosts from "./components/posts/UserPosts";
import Settings from "./components/settings/Settings";

import SinglePost from "./components/posts/SinglePost";
import UpdatePost from "./components/posts/UpdatePost";
import EditProfile from "./components/profile/EditProfile";
import ProfileWrapper from "./components/profile/ProfileWrapper";
import MessagesWithUser from "./components/messages/MessagesWithUser";

function App() {
  const { currentUser } = useAuth();
  return (
    <div>
      <Routes>
        <Route
          path="/signup"
          element={<SignUp />}
        />
        <Route
          path="/login"
          element={<Login />}
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
              <UserNotifications />
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
      </Routes>
    </div>
  );
}

export default App;
