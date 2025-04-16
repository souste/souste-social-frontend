import { Route, Routes, Navigate } from "react-router-dom";
import SinglePost from "./components/SinglePost";
import Header from "./components/Header";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import CreatePost from "./components/CreatePost";
import UpdatePost from "./components/UpdatePost";
import UpdateComment from "./components/UpdateComment";
import ProfileWrapper from "./components/ProfileWrapper";
import EditProfile from "./components/EditProfile";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import Messages from "./components/Messages";
import Settings from "./components/Settings";
import { useAuth } from "./context/AuthContext";
import "./styles.css";

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
          path="/settings"
          element={<Settings />}
        />
      </Routes>
    </div>
  );
}

export default App;
