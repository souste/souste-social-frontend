import { useState } from "react";
import { useParams } from "react-router-dom";
import { createComment } from "../../api/comment";
import { createNotification } from "../../api/notification";
import { useAuth } from "../../context/AuthContext";
import { Send, MessageCircle } from "lucide-react";

const CreateComment = ({ setComments, post }) => {
  const { postId } = useParams();
  const { currentUser } = useAuth();
  const [newComment, setNewComment] = useState({
    content: "",
    user_id: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const commentData = {
        ...newComment,
        user_id: currentUser?.id,
      };
      const createdComment = await createComment(postId, commentData);

      createdComment.username = currentUser.username;
      createdComment.picture = currentUser.picture;

      setComments((prev) => [createdComment, ...prev]);
      setNewComment({ content: "", user_id: "" });

      if (post.user_id !== currentUser.id) {
        const notification = {
          type: "comment",
          referenceId: postId,
          message: `${currentUser.username} commented on your post`,
        };
        await createNotification(post.user_id, notification);
      }
    } catch (err) {
      console.error("Failed to create comment", err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg bg-white shadow-sm">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4"
      >
        <div className="flex items-start gap-3">
          <img
            src={currentUser.picture}
            alt={`${currentUser.username}'s profile`}
            className="h-10 w-10 rounded-full object-cover"
          />
        </div>

        <div className="flex-grow">
          <textarea
            name="content"
            id="content"
            value={newComment.content}
            onChange={handleChange}
            placeholder="Write a comment..."
            rows={3}
            required
            className="w-full resize-y rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 transition duration-200 ease-in-out focus:border-blue-300 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.content.trim()}
            className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateComment;
