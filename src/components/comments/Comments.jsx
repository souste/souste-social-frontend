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

      {comments.length === 0 ? (
        <div className="py-6 text-center text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {comments.map((comment) => {
            return (
              <li
                key={comment.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:shadow-sm"
              >
                <div>
                  <img
                    src={comment.picture}
                    alt={`${comment.username}'s profile`}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">
                          {comment.username}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(comment.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mb-4 pt-3 whitespace-pre-wrap text-gray-700">
                  {comment.content}
                </p>

                <div className="flex items-center justify-between">
                  <CommentLikes
                    postId={postId}
                    commentId={comment.id}
                    commentUserId={comment.user_id}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/posts/${postId}/comments/${comment.id}/edit-comment`,
                        )
                      }
                      className="flex items-center gap-1 text-blue-500 transition hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(postId, comment.id)}
                      className="flex items-center gap-1 text-red-500 transition hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Comments;
