import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getTimelinePosts } from "../../api/post";
import { useAuth } from "../../context/AuthContext";

const TimelinePosts = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [friendsPosts, setFriendsPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = currentUser.id;

  useEffect(() => {
    const fetchFriendsPosts = async () => {
      try {
        const friendsPosts = await getTimelinePosts(userId);
        setFriendsPosts(friendsPosts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch friend's posts", err);
      }
    };
    fetchFriendsPosts();
  }, [userId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown Time";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return loading ? (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-xl font-semibold text-red-600">Loading Posts...</p>
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Timeline Posts</h1>
        <button
          onClick={() => navigate("/create-post")}
          className="flex items-center rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-red-700"
        >
          <span className="mr-1">+</span>
          Create Post
        </button>
      </div>

      {friendsPosts.length === 0 ? (
        <div className="rounded-lg bg-gray-50 py-10 text-center shadow-sm">
          <p className="text-gray-500">No posts from friends yet</p>
        </div>
      ) : (
        <ul className="space-y-6">
          {friendsPosts.map((post) => (
            <li className="my-4 w-full space-y-3 bg-gray-200 p-4">
              <Link
                key={post.id}
                to={`/posts/${post.id}`}
                className="transition-transform duration-200 hover:scale-[1.01]"
              >
                {post.image !== null && (
                  <div>
                    <img
                      src={post.image}
                      alt="Post Image"
                    />
                  </div>
                )}
                <p>{post.content}</p>
                <p>
                  By <strong>{post.username}</strong> posted on:
                  {formatTimestamp(post.created_at)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TimelinePosts;
