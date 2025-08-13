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
      <div className="mb-8 flex flex-col items-center gap-4">
        <h1 className="text-center text-2xl font-bold text-stone-800">
          {isCurrentUser
            ? "Your Posts"
            : `${userProfile.first_name} ${userProfile.last_name}'s Posts`}
        </h1>

        {isCurrentUser && (
          <button
            onClick={() => navigate("/create-post")}
            className="flex items-center rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-md transition-colors duration-200 hover:bg-blue-700"
          >
            <span className="mr-1">+</span>
            Create Post
          </button>
        )}
      </div>

      {userPosts.length === 0 ? (
        <>
          {isCurrentUser ? (
            <div className="py-10 text-center">
              <p className="text-lg font-medium text-gray-500">
                You haven’t posted anything yet
              </p>
              <p className="mt-2 text-gray-400">
                Share your thoughts to make your first post!
              </p>
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-lg font-medium text-gray-500">
                {userProfile.first_name} hasn’t posted anything yet
              </p>
              <p className="mt-2 text-gray-400">
                Check back later to see their updates.
              </p>
            </div>
          )}
        </>
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
                      {isPostEdited(post) ? (
                        <>Edited {formatTimestamp(post.updated_at)} </>
                      ) : (
                        <>{formatTimestamp(post.created_at)} </>
                      )}
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

              <div className="border-t border-gray-100" />

              <div className="flex items-center justify-around px-2 py-1 text-stone-700">
                <PostLikes
                  postId={post.id}
                  post={post}
                  initialCount={post.like_count}
                  initialLiked={post.viewer_has_liked}
                />
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-blue-400"
                  onClick={() => navigate(`/posts/${post.id}#comments`)}
                  aria-label={`View comments (${post.comment_count ?? 0})`}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Comment</span>
                  <span className="ml-1 text-stone-500">
                    ({post.comment_count ?? 0})
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
