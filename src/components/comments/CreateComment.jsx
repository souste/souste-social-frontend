import { useState } from "react";
import { useParams } from "react-router-dom";
import { createComment } from "../../api/comment";
// import { createNotification } from "../../api/notification";
import { useAuth } from "../../context/AuthContext";
import { Send, Loader } from "lucide-react";
import socket from "../../../socket";

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
          recipientId: post.user_id,
          senderId: currentUser.id,
          type: "comment",
          referenceId: postId,
          message: `${currentUser.username} commented on your post`,
        };
        socket.emit("send notification", notification);
        // await createNotification(post.user_id, notification);
      }
    } catch (err) {
      console.error("Failed to create comment", err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4"
      >
        <div className="flex items-start gap-3">
          <img
            src={currentUser.picture}
            alt={`${currentUser.username}'s profile`}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-stone-200 dark:ring-stone-700"
            loading="lazy"
          />
        </div>

        <div className="relative w-full flex-grow">
          <textarea
            name="content"
            id="content"
            value={newComment.content}
            onChange={handleChange}
            placeholder="Write a comment..."
            rows={3}
            required
            className="w-full resize-y rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 pr-14 text-stone-800 placeholder-stone-400 transition duration-200 ease-in-out focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.content.trim()}
            className="absolute bottom-3 right-3 rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 dark:focus:ring-blue-400"
            aria-label="Send comment"
          >
            {isSubmitting ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateComment;
