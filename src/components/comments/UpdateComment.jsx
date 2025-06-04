import { useState, useEffect } from "react";
import {
  updateComment,
  getSingleComment,
  getComments,
} from "../../api/comment";
import { Edit } from "lucide-react";

const UpdateComment = ({
  postId,
  commentId,
  setEditCommentId,
  setComments,
}) => {
  const [comment, setComment] = useState({
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const comment = await getSingleComment(postId, commentId);
        setComment({ content: comment.content });
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };
    fetchPost();
  }, [postId, commentId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      await updateComment(postId, commentId, comment);
      setEditCommentId(null);
      const updatedComments = await getComments(postId);
      setComments(updatedComments);
    } catch (err) {
      console.error("Failed to update comment", err);
    } finally {
      setIsSubmitting(false);
      setEditCommentId(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-4 font-semibold text-gray-800">Edit Comment</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <textarea
          name="content"
          rows="5"
          id="content"
          value={comment.content}
          onChange={handleChange}
          className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          >
            <Edit className="h-5 w-5" />
            {isSubmitting ? "Saving..." : "Edit Comment"}
          </button>
          <button
            onClick={() => setEditCommentId(null)}
            className="rounded-md border border-red-600 bg-red-50 px-6 py-2 font-medium text-red-600 transition hover:bg-red-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateComment;
