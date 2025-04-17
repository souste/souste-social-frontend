import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOwnPosts } from "../api/post";
import { useAuth } from "../context/AuthContext";

const OwnPosts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [ownPosts, setOwnPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = currentUser.id;

  useEffect(() => {
    const fetchOwnPosts = async () => {
      try {
        const ownPosts = await getOwnPosts(userId);
        setOwnPosts(ownPosts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch friend's posts", err);
      }
    };
    fetchOwnPosts();
  }, [userId]);

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
      <h1>Friend's Posts</h1>
      <ul className="mx-auto mt-6 max-w-xl text-center text-xl font-semibold text-stone-700">
        {ownPosts.map((post) => (
          <Link
            key={post.id}
            to={`/posts/${post.id}`}
          >
            <li className="my-4 w-full space-y-3 bg-red-200 p-4">
              <p>{post.content}</p>
              <p>
                By <strong>{post.username}</strong> posted on:
                {formatTimestamp(post.created_at)}
              </p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default OwnPosts;
