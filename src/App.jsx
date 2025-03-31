import { Route, Routes, Navigate } from "react-router-dom";
import Posts from "./components/Posts";
import SinglePost from "./components/SinglePost";
import Header from "./components/Header";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import CreatePost from "./components/CreatePost";
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
          element={<CreatePost />}
        />
      </Routes>
    </div>
  );
}

export default App;
