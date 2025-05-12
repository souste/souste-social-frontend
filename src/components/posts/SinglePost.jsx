import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getSinglePost, deletePost } from "../../api/post";
import Comments from "../comments/Comments";
import PostLikes from "../posts/PostLikes";
import { Trash2, Edit, ArrowLeft } from "lucide-react";

const SinglePost = () => {
  const [singlePost, setSinglePost] = useState({});
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  const navigate = useNavigate();

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

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone",
    );
    if (!confirmDelete) return;
    try {
      const success = await deletePost(postId);
      if (success) {
        navigate("/");
      }
    } catch (err) {
      console.error("Failed to delete post", err);
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

        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          {singlePost.image && (
            <div className="w-full overflow-hidden">
              <img
                src={singlePost.image}
                alt="Post"
                className="max-h-[500px] w-full object-contain"
                style={{
                  maxHeight: "500px",
                  aspectRatio: "16/9",
                  objectFit: "contain",
                }}
              />
            </div>
          )}
        </div>

        <div className="mb-6 text-lg whitespace-pre-wrap text-gray-800">
          {singlePost.content}
        </div>

        <div className="flex items-center justify-between border-t pt-4 text-sm text-gray-500">
          <div>
            By{" "}
            <span className="font-medium text-blue-600">
              {singlePost.username}
            </span>
          </div>
          <div>{formatTimestamp(singlePost.created_at)}</div>
        </div>

        <PostLikes
          postId={singlePost.id}
          post={singlePost}
        />

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => navigate(`/posts/${postId}/edit-post`)}
            className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            <Edit className="h-5 w-5" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(postId)}
            className="flex items-center gap-2 rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
          >
            <Trash2 className="h-5 w-5" />
            Delete
          </button>
        </div>

        <Comments post={singlePost} />
      </div>
    </div>
  );
};

export default SinglePost;
