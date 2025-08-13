import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSinglePost, deletePost } from "../../api/post";
import Comments from "../comments/Comments";
import PostLikes from "../posts/PostLikes";
import { useAuth } from "../../context/AuthContext";
import { Trash2, Edit, ArrowLeft, MoreVertical } from "lucide-react";
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
        behaviour: "smooth",
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
        <div className="mb-2 h-4 w-32 rounded">
          <div className="h-4 w-48 rounded">
            <p className="mt-4 text-lg font-medium text-gray-500">
              Loading Post...
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <button
          onClick={() => navigate("/")}
          className="mb-4 flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Timeline
        </button>

        <div className="overflow-hidden rounded-xl bg-gray-100 shadow-lg">
          {singlePost.image && (
            <div className="flex w-full items-center justify-center bg-gray-100">
              <img
                src={singlePost.image}
                alt="Post Image"
                className="max-h-[50vh] w-full rounded-t-xl object-contain"
              />
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="mb-6 whitespace-pre-wrap text-lg text-gray-800">
            {singlePost.content}
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
              <div>
                Posted By{" "}
                <span className="font-semibold text-blue-700">
                  {singlePost.username}
                </span>
              </div>
              <span className="font-medium text-blue-600">
                {isPostEdited()
                  ? `Edited ${formatTimestamp(singlePost.updated_at)}`
                  : formatTimestamp(singlePost.created_at)}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <PostLikes
                postId={singlePost.id}
                post={singlePost}
              />

              {singlePost.user_id === currentUser.id && (
                <div
                  className="relative"
                  ref={dropdownRef}
                >
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center justify-center rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                      <button
                        onClick={handleEdit}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="h-4 w-4" />
                        Edit Post
                      </button>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleDelete(postId);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Post
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div
            id="comments"
            ref={commentsRef}
          >
            <Comments post={singlePost} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;
