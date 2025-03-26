import { Route, Routes } from "react-router-dom";
import Posts from "./components/Posts";
import SinglePost from "./components/SinglePost";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Posts />} />
      <Route path="/posts/:postId" element={<SinglePost />} />
    </Routes>
  );
}

export default App;
