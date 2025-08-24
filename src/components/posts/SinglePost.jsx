import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSinglePost, deletePost } from "../../api/post";
import Comments from "../comments/Comments";
import PostLikes from "../posts/PostLikes";
import { useAuth } from "../../context/AuthContext";
import {
  Trash2,
  Edit,
  ArrowLeft,
  MoreVertical,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const SinglePost = () => {
  const { currentUser } = useAuth();
  const [singlePost, setSinglePost] = useState({});
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { postId } = useParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const location = useLocation();
  const commentsRef = useRef(null);

  const isPostEdited = () => {
    if (!singlePost.updated_at || !singlePost.created_at) return false;
    return (
      new Date(singlePost.updated_at).getTime() !==
      new Date(singlePost.created_at).getTime()
    );
  };

  useEffect(() => {
    if (!loading && location.hash === "#comments" && commentsRef.current) {
      commentsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      const textarea = commentsRef.current.querySelector("textarea");
      if (textarea) textarea.focus();
    }
  }, [loading, location.hash]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getSinglePost(postId);
        setSinglePost(post);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch post", err);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (postId) => {
    toast(
      (t) => (
        <span>
          Are you sure you want to delete this post?
          <div className="mt-2 flex gap-2">
            <button
              className="rounded bg-red-600 px-3 py-1 text-white"
              onClick={async () => {
                try {
                  const success = await deletePost(postId);
                  if (success) {
                    toast.success("Post Deleted");
                    navigate("/");
                  }
                } catch (err) {
                  toast.error("Failed to delete post");
                }
                toast.dismiss(t.id);
              }}
            >
              Yes
            </button>
            <button
              className="rounded bg-gray-300 px-3 py-1"
              onClick={() => {
                toast.dismiss(t.id);
                toast("Cancelled", { icon: "✖️", duration: 2000 });
              }}
            >
              Cancel
            </button>
          </div>
        </span>
      ),
      { duration: 5000 },
    );
  };

  const handleEdit = () => {
    navigate(`/posts/${postId}/edit-post`);
    setDropdownOpen(false);
  };

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
          Loading Post...
        </p>
      </div>
    </div>
  ) : (
    <div className="py-10">
      <div className="mx-auto max-w-3xl px-4">
        <button
          onClick={() => navigate("/")}
          className="-mx-2 mb-4 inline-flex items-center gap-2 rounded-md px-2 py-1 text-stone-600 transition hover:bg-stone-100 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Timeline
        </button>

        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow transition-all duration-200 hover:shadow-md dark:border-stone-800 dark:bg-stone-900">
          <div className="flex items-center justify-between border-b border-gray-100 p-4 dark:border-stone-800">
            <div className="flex items-center gap-3">
              {singlePost.picture && (
                <img
                  src={singlePost.picture}
                  alt={`${singlePost.username}'s profile`}
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
                  loading="lazy"
                />
              )}
              <div>
                <p className="font-medium text-stone-800 dark:text-stone-100">
                  {singlePost.username}
                </p>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {isPostEdited()
                    ? `Edited ${formatTimestamp(singlePost.updated_at)}`
                    : formatTimestamp(singlePost.created_at)}
                </p>
              </div>
            </div>

            {singlePost.user_id === currentUser.id && (
              <div
                className="relative"
                ref={dropdownRef}
              >
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center rounded-full p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200 dark:focus-visible:ring-offset-stone-900"
                  aria-label="Post options"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-stone-900 dark:ring-stone-700">
                    <button
                      onClick={handleEdit}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-stone-700 hover:bg-stone-50 dark:text-stone-200 dark:hover:bg-stone-800"
                    >
                      <Edit className="h-4 w-4" />
                      Edit Post
                    </button>
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleDelete(postId);
                      }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-stone-800"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Post
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {singlePost.content && (
            <div className="p-6">
              <div className="whitespace-pre-wrap break-words text-[15px] leading-6 text-stone-800 dark:text-stone-100">
                {singlePost.content}
              </div>
            </div>
          )}

          {singlePost.image && (
            <div className="overflow-hidden ring-1 ring-stone-200 dark:ring-stone-700">
              <div className="relative bg-stone-100 dark:bg-stone-800">
                <img
                  src={singlePost.image}
                  alt="Post image"
                  className="max-h-[60vh] w-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 px-2 py-1 text-stone-700 dark:border-stone-800 dark:text-stone-300">
            <PostLikes
              postId={singlePost.id}
              post={singlePost}
              initialCount={singlePost.like_count}
              initialLiked={singlePost.viewer_has_liked}
            />

            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-stone-50 focus-visible:ring-2 focus-visible:ring-blue-400 dark:hover:bg-stone-800"
              onClick={() => {
                document
                  .getElementById("comments")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
                commentsRef.current?.querySelector("textarea")?.focus();
              }}
              aria-label={`View comments (${singlePost.comment_count ?? 0})`}
            >
              <MessageCircle className="h-5 w-5" />
              <span>Comments</span>
            </button>
          </div>
        </div>

        <div
          id="comments"
          ref={commentsRef}
          className="mt-8 scroll-mt-24"
        >
          <Comments post={singlePost} />
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
