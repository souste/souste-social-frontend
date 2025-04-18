import { Route, Routes, Navigate } from "react-router-dom";
import SinglePost from "./components/posts/SinglePost";
import Header from "./components/menu/Header";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import CreatePost from "./components/posts/CreatePost";
import UpdatePost from "./components/posts/UpdatePost";
import UpdateComment from "./components/comments/UpdateComment";
import ProfileWrapper from "./components/profile/ProfileWrapper";
import EditProfile from "./components/profile/EditProfile";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import Messages from "./components/messages/Messages";
import Settings from "./components/settings/Settings";
import { useAuth } from "./context/AuthContext";
import "./styles.css";
import MessagesWithUser from "./components/messages/MessagesWithUser";

function App() {
  const { currentUser } = useAuth();
  return (
    <div>
      <Header />
      <Routes>
        <Route
          path="/"
          element={currentUser ? <HomePage /> : <Navigate to="/login" />}
          // When I provide guest access can I add a default user object?
        />
        <Route
          path="/profile"
          element={<ProfilePage />}
        />
        <Route
          path="/posts/:postId"
          element={<SinglePost />}
        />
        <Route
          path="/signup"
          element={<SignUp />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/create-post"
          // In the final version of this app do I even need a link - or put this component directly into the home/profile page?
          element={<CreatePost />}
        />
        <Route
          path="/posts/:postId/edit-post"
          element={<UpdatePost />}
        />
        <Route
          path="/posts/:postId/comments/:commentId/edit-comment"
          element={<UpdateComment />}
        />
        <Route
          path="/profile/edit"
          element={<EditProfile />}
        />
        <Route
          path="/profile/:profileId"
          element={<ProfileWrapper />}
        />
        <Route
          path="/messages"
          element={<Messages />}
        />
        <Route
          path="/messages/:userId/conversation/:friendId"
          element={<MessagesWithUser />}
        />
        <Route
          path="/settings"
          element={<Settings />}
        />
      </Routes>
    </div>
  );
}

export default App;
