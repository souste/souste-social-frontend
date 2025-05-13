import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateComment, getSingleComment } from "../../api/comment";
import { ArrowLeft } from "lucide-react";

const UpdateComment = () => {
  const navigate = useNavigate();
  const { postId, commentId } = useParams();
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
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error("Failed to update comment", err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <button
        onClick={() => navigate(`/posts/${postId}`)}
        className="mb-4 flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-gray-800"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Post
      </button>

      <h1 className="mb-4 text-2xl font-semibold text-gray-800">
        Edit Comment
      </h1>
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
        >
          {isSubmitting ? "Saving..." : "Edit Comment"}
        </button>
      </form>
    </div>
  );
};

export default UpdateComment;
