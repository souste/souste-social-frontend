import { useState } from "react";
import { useParams } from "react-router-dom";
import { createComment } from "../api/comment";
import { useAuth } from "../context/AuthContext";

const CreateComment = () => {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const [comment, setComment] = useState({
    content: "",
    user_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setComment((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(comment);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const commentData = {
        ...comment,
        user_id: currentUser?.id || 15,
      };
      await createComment(postId, commentData);
    } catch (err) {
      console.error("Failed to create comment", err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div className="mb-3 flex flex-col gap-2 sm:items-center">
          <label
            htmlFor="content"
            className="text-sm font-semibold text-gray-700"
          >
            Your Comment:
          </label>
          <textarea
            name="content"
            id="content"
            value={comment.content}
            onChange={handleChange}
            className="min-h-32 w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          //   disable={isSubmitting}
          className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
        >
          {isSubmitting ? "Creating..." : "Create Comment"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="rounded-full border bg-red-300 px-3 py-3 font-semibold text-white hover:bg-red-200"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default CreateComment;
