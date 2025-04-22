import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateMessage, getSingleMessage } from "../../api/message";

const UpdateMessage = () => {
  const navigate = useNavigate();
  const { userId, messageId } = useParams();
  const [message, setMessage] = useState({
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const message = await getSingleMessage(userId, messageId);
        console.log("userId", userId);
        console.log("messageId", messageId);
        console.log("message from updateMessage", message);
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
      navigate("/messages");
    } catch (err) {
      console.error("Failed to update message", err);
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
        <div>
          <label htmlFor="message">Edit Message</label>
          <textarea
            name="message"
            id="message"
            value={message.message}
            onChange={handleChange}
            className="min-h-32 w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
        >
          Edit Message
        </button>
      </form>
      <div className="mt-6 flex justify-center gap-6">
        <button
          onClick={() => navigate("/messages")}
          className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-gray-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default UpdateMessage;
