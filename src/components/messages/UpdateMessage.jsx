import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  updateMessage,
  getSingleMessage,
  getConversation,
} from "../../api/message";
import { Edit } from "lucide-react";

const UpdateMessage = ({
  messageId,
  setEditMessageId,
  setConversation,
  friendId,
}) => {
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const [message, setMessage] = useState({
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const message = await getSingleMessage(userId, messageId);
        setMessage(message);
      } catch (err) {
        console.error("Failed to fetch message", err);
      }
    };
    fetchMessage();
  }, [userId, messageId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMessage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsSubmitting(true);
      await updateMessage(userId, messageId, message);
      setEditMessageId(null);
      const updatedConversation = await getConversation(userId, friendId);
      setConversation(updatedConversation);
    } catch (err) {
      console.error("Failed to update message", err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
      setEditMessageId(null);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold text-gray-800">
        Edit Message
      </h1>
      <form
        className="space-y-6"
        onSubmit={handleSubmit}
      >
        <textarea
          name="message"
          rows="5"
          id="message"
          value={message.message}
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
            {isSubmitting ? "Saving..." : "Edit Message"}
          </button>
          <button
            onClick={() => setEditMessageId(null)}
            className="rounded-md border border-red-600 bg-red-50 px-6 py-2 font-medium text-red-600 transition hover:bg-red-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateMessage;
