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
  setUpdatedCommentIds,
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
      setUpdatedCommentIds((prev) => new Set(prev).add(commentId));
    } catch (err) {
      console.error("Failed to update comment", err);
    } finally {
      setIsSubmitting(false);
      setEditCommentId(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-1 py-1">
      <form
        onSubmit={handleSubmit}
        className="relative space-y-3"
      >
        <div className="relative w-full pb-6">
          <button
            type="button"
            onClick={() => setEditCommentId(null)}
            aria-label="Cancel editing"
            className="absolute right-2 top-2 z-10 rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative w-full">
            <textarea
              name="content"
              id="content"
              rows={5}
              value={comment.content}
              onChange={handleChange}
              placeholder="Update your comment…"
              className="w-full resize-y rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 pr-14 text-[15px] leading-6 text-stone-800 placeholder-stone-400 transition duration-200 ease-in-out focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            />

            <button
              type="submit"
              disabled={isSubmitting || !comment.content.trim()}
              className="absolute bottom-3 right-3 rounded-full bg-blue-600 p-2 text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 dark:focus:ring-blue-700"
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
