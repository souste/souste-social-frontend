import "./styles.css";
import { Route, Routes, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import SinglePost from "./components/posts/SinglePost";
import Header from "./components/menu/Header";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import CreatePost from "./components/posts/CreatePost";
import UpdatePost from "./components/posts/UpdatePost";
import ProfileWrapper from "./components/profile/ProfileWrapper";
import EditProfile from "./components/profile/EditProfile";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import Messages from "./components/messages/Messages";
import Settings from "./components/settings/Settings";
import { useAuth } from "./context/AuthContext";
import MessagesWithUser from "./components/messages/MessagesWithUser";
import UserNotifications from "./components/notifications/UserNotifications";

// Some of these routes are overly long and not needed

function App() {
  const { currentUser } = useAuth();
  return (
    <div>
      <Header />
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
              <MainLayout>
                <HomePage />
              </MainLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
          // When I provide guest access can I add a default user object?
        />
        <Route
          path="/create-post"
          // In the final version of this app do I even need a link - or put this component directly into the home/profile page?
          element={
            <MainLayout>
              <CreatePost />
            </MainLayout>
          }
        />
        <Route
          path="/messages"
          element={
            <MainLayout>
              <Messages />
            </MainLayout>
          }
        />

        <Route
          path="/notifications"
          element={
            <MainLayout>
              <UserNotifications />
            </MainLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <MainLayout>
              <ProfilePage />
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />

        <Route
          path="/posts/:postId"
          element={
            <MainLayout>
              <SinglePost />
            </MainLayout>
          }
        />

        <Route
          path="/posts/:postId/edit-post"
          element={
            <MainLayout>
              <UpdatePost />
            </MainLayout>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <MainLayout>
              <EditProfile />
            </MainLayout>
          }
        />
        <Route
          path="/profile/:profileId"
          element={
            <MainLayout>
              <ProfileWrapper />
            </MainLayout>
          }
        />

        <Route
          path="/messages/:userId/conversation/:friendId"
          element={
            <MainLayout>
              <MessagesWithUser />
            </MainLayout>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
