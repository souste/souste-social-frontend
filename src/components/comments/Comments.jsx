import { useState, useEffect } from "react";
import { getComments, deleteComment } from "../../api/comment";
import { useParams, useNavigate } from "react-router-dom";
import CreateComment from "./CreateComment";

const Comments = () => {
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
      }
    };
    fetchComments();
  }, [postId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
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
        alert("Message deleted successfully");
      }
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  return loading ? (
    <p className="mt-40 text-center text-xl font-semibold">
      The Comments are loading...
    </p>
  ) : (
    <div className="mt-5 space-y-3">
      <h1 className="text-xl">Comments</h1>
      <CreateComment setComments={setComments} />
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
