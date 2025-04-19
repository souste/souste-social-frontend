import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { updateComment, getSingleComment } from "../../api/comment";

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
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Update Comment
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <label
          htmlFor="content"
          className="text-sm font-semibold text-gray-700"
        >
          Edit Comment:
        </label>
        <textarea
          name="content"
          id="content"
          value={comment.content}
          onChange={handleChange}
          className="min-h-32 w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
        >
          Edit Comment
        </button>
      </form>
      <div className="mt-6 flex justify-center gap-6">
        <button
          onClick={() => navigate(`/posts/${postId}`)}
          className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-gray-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default UpdateComment;
