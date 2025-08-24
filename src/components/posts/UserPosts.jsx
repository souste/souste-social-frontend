import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserPosts } from "../../api/post";
import PostLikes from "../posts/PostLikes";
import { useAuth } from "../../context/AuthContext";
import { MessageCircle } from "lucide-react";

const UserPosts = ({ profileId, userProfile }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = profileId || currentUser.id;

  const isCurrentUser = userId === currentUser.id;

  const isPostEdited = (post) => {
    if (!post.updated_at || !post.created_at) return false;
    return (
      new Date(post.updated_at).getTime() !==
      new Date(post.created_at).getTime()
    );
  };

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const userPosts = await getUserPosts(userId);
        setUserPosts(userPosts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch friend's posts", err);
      } finally {
        setLoading(false);
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
        <div className="mb-2 h-4 w-32 rounded bg-stone-200 dark:bg-stone-700" />
        <div className="h-4 w-48 rounded bg-stone-200 dark:bg-stone-700" />
        <p className="mt-4 text-lg font-medium text-stone-500 dark:text-stone-400">
          Loading Posts...
        </p>
      </div>
    </div>
  ) : (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* Compact header with count + conditional New button */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">
          {isCurrentUser
            ? "Your posts"
            : `${userProfile?.first_name ?? ""} ${userProfile?.last_name ?? ""}'s posts`}
          <span className="ml-2 text-sm font-normal text-stone-500 dark:text-stone-400">
            ({userPosts.length})
          </span>
        </h2>

        {isCurrentUser && userPosts.length > 0 && (
          <button
            onClick={() => navigate("/create-post")}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            New
          </button>
        )}
      </div>

      {userPosts.length === 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white p-10 text-center shadow-sm dark:border-stone-800 dark:bg-stone-900">
          {isCurrentUser ? (
            <>
              <p className="text-lg font-medium text-stone-600 dark:text-stone-300">
                You haven’t posted anything yet
              </p>
              <p className="mt-2 text-stone-500 dark:text-stone-400">
                Share your thoughts to make your first post!
              </p>
              <button
                onClick={() => navigate("/create-post")}
                className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                Create Your First Post
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-stone-600 dark:text-stone-300">
                {userProfile?.first_name} hasn’t posted anything yet
              </p>
              <p className="mt-2 text-stone-500 dark:text-stone-400">
                Check back later to see their updates.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {userPosts.map((post) => (
            <div
              key={post.id}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow transition-all duration-200 hover:shadow-md dark:border-stone-800 dark:bg-stone-900"
            >
              <Link
                to={`/posts/${post.id}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-900"
              >
                <div className="flex items-center gap-3 border-b border-gray-100 p-4 dark:border-stone-800">
                  <img
                    src={post.picture}
                    alt={`${post.username}'s profile`}
                    className="h-10 w-10 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-medium text-stone-800 dark:text-stone-100">
                      {post.username}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      {isPostEdited(post)
                        ? `Edited ${formatTimestamp(post.updated_at)}`
                        : formatTimestamp(post.created_at)}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="mb-4 line-clamp-6 whitespace-pre-wrap break-words text-[15px] leading-6 text-stone-800 dark:text-stone-100">
                    {post.content}
                  </p>

                  {post.image && (
                    <div className="overflow-hidden rounded-lg ring-1 ring-stone-200 dark:ring-stone-700">
                      <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-800">
                        <img
                          src={post.image}
                          alt="Post content"
                          className="absolute inset-0 h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Link>

              <div className="border-t border-gray-100 dark:border-stone-800" />

              <div className="flex items-center justify-between px-2 py-1 text-stone-700 dark:text-stone-300">
                <PostLikes
                  postId={post.id}
                  post={post}
                  initialCount={post.like_count}
                  initialLiked={post.viewer_has_liked}
                />
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-stone-800"
                  onClick={() => navigate(`/posts/${post.id}#comments`)}
                  aria-label={`View comments (${post.comment_count ?? 0})`}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>View comments</span>
                  <span className="ml-1 tabular-nums text-stone-500 dark:text-stone-400">
                    {post.comment_count ?? 0}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPosts;
