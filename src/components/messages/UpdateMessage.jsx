import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  updateMessage,
  getSingleMessage,
  getConversation,
} from "../../api/message";
import { Edit, Loader, Check, X } from "lucide-react";

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
    <div className="mx-auto max-w-lg px-4 py-2">
      <form
        className="relative space-y-4 rounded-lg p-3"
        onSubmit={handleSubmit}
      >
        <div className="relative w-full pb-4">
          <button
            type="button"
            onClick={() => setEditMessageId(null)}
            className="absolute top-2 right-3 z-10 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative w-full">
            <textarea
              name="message"
              rows="5"
              id="message"
              value={message.message}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />

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

export default UpdateMessage;
