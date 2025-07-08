import { useState } from "react";
import { useParams } from "react-router-dom";
// import { createMessage } from "../../api/message";
// import { createNotification } from "../../api/notification";
import { useAuth } from "../../context/AuthContext";
import { Send, Loader } from "lucide-react";
import socket from "../../../socket";

export const CreateMessage = () => {
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
      // const messageData = {
      //   message: newMessage.message,
      //   user_id: userId || 15,
      // };
      // const createdMessage = await createMessage(userId, friendId, messageData);
      // setConversation((prev) => [...prev, createdMessage]);

      socket.emit("send message", {
        userId,
        friendId,
        message: newMessage.message,
        username: currentUser.username,
      });

      setNewMessage({ message: "" });
      const notification = {
        recipientId: String(friendId),
        senderId: userId,
        type: "message",
        referenceId: friendId,
        message: `${currentUser.username} sent you a message`,
      };
      // await createNotification(friendId, notification);

      socket.emit("send notification", notification);
    } catch (err) {
      console.error("Failed to create message", err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <form
        className="relative"
        onSubmit={handleSubmit}
      >
        <textarea
          name="message"
          id="message"
          value={newMessage.message}
          placeholder="Type your message..."
          onChange={handleChange}
          className="w-full resize-none rounded-lg border border-blue-200 bg-white px-4 py-3 pr-14 text-gray-700 shadow-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          rows="3"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="absolute right-3 bottom-3 rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateMessage;
