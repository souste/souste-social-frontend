import { useState, useEffect, useRef } from "react";
import { getComments, deleteComment } from "../../api/comment";
import { useParams } from "react-router-dom";
import CreateComment from "./CreateComment";
import CommentLikes from "./CommentLikes";
import UpdateComment from "./UpdateComment";
import { useAuth } from "../../context/AuthContext";
import { Trash2, Edit, MessageCircle, MoreVertical } from "lucide-react";

const Comments = ({ post }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const { postId } = useParams();
  const dropdownRefs = useRef({});
  const [editCommentId, setEditCommentId] = useState(null);
  const [updatedCommentIds, setUpdatedCommentIds] = useState(new Set());

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideDropdown = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(event.target),
      );
      if (!clickedInsideDropdown) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    setOpenDropdownId(null);
  };

  const handleEdit = async (commentId) => {
    setEditCommentId(commentId);
    setOpenDropdownId(null);
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
              Loading Comments...
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="mt-8 rounded-xl bg-white shadow-md">
      <div className="p-6">
        <div className="flex items-center gap-2">
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
                {editCommentId === comment.id && (
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <Edit className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        Editing comment
                      </span>
                    </div>
                    <UpdateComment
                      commentId={comment.id}
                      postId={postId}
                      setEditCommentId={setEditCommentId}
                      setComments={setComments}
                      setUpdatedCommentIds={setUpdatedCommentIds}
                    />
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={comment.picture}
                      alt={`${comment.username}'s profile`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {comment.username}{" "}
                        <span className="text-xs text-gray-500">
                          {updatedCommentIds.has(comment.id)
                            ? `Edited: ${formatTimestamp(comment.updated_at)}`
                            : formatTimestamp(comment.created_at)}
                        </span>
                      </p>
                    </div>
                  </div>
                  {comment.user_id === currentUser.id && (
                    <div
                      className="relative"
                      ref={(el) => (dropdownRefs.current[comment.id] = el)}
                    >
                      <button
                        onClick={() =>
                          setOpenDropdownId(
                            openDropdownId === comment.id ? null : comment.id,
                          )
                        }
                        className="flex items-center justify-center rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>

                      {openDropdownId === comment.id && (
                        <div className="ring-opacity-5 absolute top-full right-0 z-10 mt-1 w-40 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black">
                          <button
                            onClick={() => {
                              handleEdit(comment.id);
                            }}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            <Edit className="h-4 w-4" />
                            Edit Comment
                          </button>
                          <button
                            onClick={() => handleDelete(postId, comment.id)}
                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Comment
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="mb-4 pt-3 whitespace-pre-wrap text-gray-700">
                  {comment.content}
                </p>

                <div className="flex items-center justify-between">
                  <CommentLikes
                    postId={postId}
                    commentId={comment.id}
                    commentUserId={comment.user_id}
                    setComments={setComments}
                  />
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
