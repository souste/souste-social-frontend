import { useState } from "react";
import { useParams } from "react-router-dom";
import { createMessage } from "../../api/message";
import { createNotification } from "../../api/notification";
import { useAuth } from "../../context/AuthContext";

export const CreateMessage = ({ setConversation }) => {
  const { friendId } = useParams();
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const [newMessage, setNewMessage] = useState({
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewMessage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const messageData = {
        message: newMessage.message,
        user_id: userId || 15,
      };
      const createdMessage = await createMessage(userId, friendId, messageData);
      setConversation((prev) => [...prev, createdMessage]);
      setNewMessage({ message: "" });
      const notification = {
        type: "message",
        // This is the same as convo ID so should be fine:
        referenceId: friendId,
        message: `${currentUser.username} sent you a message`,
      };
      await createNotification(friendId, notification);
    } catch (err) {
      console.error("Failed to create message", err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-3 flex flex-col gap-2 sm:items-center">
          <label
            htmlFor="message"
            className="text-sm font-semibold text-gray-700"
          >
            New Message
          </label>
          <textarea
            name="message"
            id="message"
            value={newMessage.message}
            onChange={handleChange}
            className="min-h-32 w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
        >
          {isSubmitting ? "Creating..." : "Create Message"}
        </button>
      </form>
    </div>
  );
};

export default CreateMessage;
