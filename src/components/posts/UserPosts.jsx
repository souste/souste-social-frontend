import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserPosts } from "../../api/post";
import { useAuth } from "../../context/AuthContext";

const UserPosts = ({ profileId, userProfile }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = profileId || currentUser.id;

  const isCurrentUser = userId === currentUser.id;

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userPosts = await getUserPosts(userId);
        setUserPosts(userPosts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch friend's posts", err);
      }
    };
    fetchUserPosts();
  }, [userId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown Time";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return diffMins <= 1 ? "Just Now" : `${diffMins} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    } else if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else {
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
  };

  return loading ? (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse text-center">
        <div className="mb-2 h-4 w-32 rounded">
          <div className="h-4 w-48 rounded">
            <p className="mt-4 text-lg font-medium text-gray-500">
              Loading Posts...
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">
          {isCurrentUser
            ? "Your Posts"
            : `${userProfile.first_name}'s ${userProfile.last_name}  Posts`}
        </h1>

        {isCurrentUser && (
          <button
            onClick={() => navigate("/create-post")}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-red-700"
          >
            <span className="mr-1">+</span>
            Create Post
          </button>
        )}
      </div>

      {userPosts.length === 0 ? (
        <div className="rounded-lg bg-white p-10 text-center shadow">
          <p className="text-lg font-medium text-gray-500">
            No posts from friends yet
          </p>
          <p className="mt-2 text-gray-400">
            Start by connecting with friends or create your first post!
          </p>
          <button
            onClick={() => navigate("/create-post")}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="overflow-hidden rounded-xl bg-white shadow transition-all duration-200 hover:shadow-md"
            >
              <Link
                to={`/posts/${post.id}`}
                className="block"
              >
                <div className="flex items-center gap-3 border-b border-gray-100 p-4">
                  <img
                    src={post.picture}
                    alt={`${post.username}'s profile`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{post.username}</p>
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(post.created_at)}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="mb-4 whitespace-pre-wrap text-gray-800">
                    {post.content}
                  </p>
                  {post.image && (
                    <div className="overflow-hidden rounded-lg">
                      <div className="relative aspect-[4/3] bg-gray-100">
                        <img
                          src={post.image}
                          alt="Post Content"
                          className="absolute inset-0 h-full w-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;
