import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPosts } from "../api/post";

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then((posts) => {
      setPosts(posts);
      setLoading(false);
    });
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown Time";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return loading ? (
    <p className="mt-40 text-center text-xl font-semibold">
      The Posts are loading...
    </p>
  ) : (
    <div>
      <div className="mt-3 flex flex-col sm:items-center">
        <button
          onClick={() => navigate("/create-post")}
          className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
        >
          Create Post
        </button>
      </div>
      <ul className="mx-auto mt-6 max-w-xl text-center text-xl font-semibold text-stone-700">
        {posts.map((post) => {
          return (
            <Link
              key={post.id}
              to={`/posts/${post.id}`}
            >
              <li className="my-4 w-full space-y-3 bg-red-200 p-4">
                <h3>{post.content}</h3>
                <p>
                  By <strong>{post.username}</strong> posted on:
                  {formatTimestamp(post.created_at)}
                </p>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Posts;
