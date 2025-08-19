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
  setUpdatedMessageIds,
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
      setUpdatedMessageIds((prev) => new Set(prev).add(messageId));
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
            className="absolute right-3 top-2 z-10 text-stone-400 hover:text-stone-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 dark:text-stone-400 dark:hover:text-stone-200 dark:focus-visible:ring-blue-500/40"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative w-full">
            <textarea
              name="message"
              id="message"
              rows="5"
              value={message.message}
              onChange={handleChange}
              className="w-full resize-none rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 pr-14 text-[15px] leading-6 text-stone-800 placeholder-stone-400 shadow-sm transition focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="absolute bottom-3 right-3 rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-50 dark:focus-visible:ring-blue-500/40"
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
