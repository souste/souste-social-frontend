import { Route, Routes, Navigate } from "react-router-dom";
import Posts from "./components/Posts";
import SinglePost from "./components/SinglePost";
import Header from "./components/Header";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import CreatePost from "./components/CreatePost";
import UpdatePost from "./components/UpdatePost";
import UpdateComment from "./components/UpdateComment";
import Profile from "./components/Profile";
import ProfileWrapper from "./components/ProfileWrapper";
import EditProfile from "./components/EditProfile";
import UserList from "./components/UserList";
import ProfilePage from "./pages/ProfilePage";
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
          element={currentUser ? <Posts /> : <Navigate to="/login" />}
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
          path="create-post"
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
        {/* <Route
          path="/profile"
          element={<Profile />}
        /> */}
        <Route
          path="/profile/edit"
          element={<EditProfile />}
        />
        <Route
          path="/user-list"
          element={<UserList />}
        />
        <Route
          path="/profile/:profileId"
          element={<ProfileWrapper />}
        />
      </Routes>
    </div>
  );
}

export default App;
