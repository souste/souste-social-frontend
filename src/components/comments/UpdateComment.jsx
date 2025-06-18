import { useState, useEffect } from "react";
import {
  updateComment,
  getSingleComment,
  getComments,
} from "../../api/comment";
import { Check, Loader, X } from "lucide-react";

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
      <button
        type="button"
        onClick={() => setEditCommentId(null)}
        className="flex items-center gap-1 text-sm text-gray-600 transition hover:text-gray-800"
      >
        <X className="h-4 w-4" />
        Cancel
      </button>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="relative w-full flex-grow">
          <textarea
            name="content"
            rows={"5"}
            id="content"
            value={comment.content}
            onChange={handleChange}
            className="w-full resize-y rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 pr-14 text-gray-700 transition duration-200 ease-in-out focus:border-blue-300 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
          <div className="relative w-full flex-grow">
            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute right-3 bottom-3 rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Check className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateComment;
