import { useState, useEffect } from "react";
import { getComments, deleteComment } from "../../api/comment";
import { useParams, useNavigate } from "react-router-dom";
import CreateComment from "./CreateComment";
import CommentLikes from "./CommentLikes";
import { Trash2, Edit, MessageCircle } from "lucide-react";

const Comments = ({ post }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const comments = await getComments(postId);
        setComments(comments);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch comments", err);
        setLoading(false);
      }
    };
    fetchComments();
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

  const handleDelete = async (postId, commentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment? This action cannot be undone",
    );

    if (!confirmDelete) return;
    try {
      const success = await deleteComment(postId, commentId);

      if (success) {
        const updatedComments = await getComments(postId);
        setComments(updatedComments);
      }
    } catch (err) {
      console.error("Failed to delete comment", err);
      alert("Failed to delete comment. Please try again");
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
    <div className="mt-8 rounded-xl bg-white shadow-md">
      <div className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Comments ({comments.length})
          </h2>
        </div>
      </div>
      <CreateComment
        setComments={setComments}
        post={post}
      />
      <ul className="space-y-3">
        {comments.map((comment) => {
          return (
            <li
              key={comment.id}
              className="space-y-3 bg-gray-300 p-4"
            >
              <p>{comment.content}</p>
              <p>
                By <strong>{comment.username}</strong> posted on{" "}
                {formatTimestamp(comment.created_at)}
              </p>
              <CommentLikes
                postId={postId}
                commentId={comment.id}
                commentUserId={comment.user_id}
              />
              <button
                onClick={() =>
                  navigate(
                    `/posts/${postId}/comments/${comment.id}/edit-comment`,
                  )
                }
                className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-red-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(postId, comment.id)}
                className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-red-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Comments;
