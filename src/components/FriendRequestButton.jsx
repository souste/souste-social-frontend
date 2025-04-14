import { useState, useEffect } from "react";
import { sendRequest, getFriendStatus } from "../api/friend";

const FriendRequestButton = ({ userId, friendId }) => {
  const [status, setStatus] = useState("none");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const currentStatus = await getFriendStatus(userId, friendId);
        setStatus(currentStatus);
      } catch (err) {
        console.error("Failed to check friendship status", err);
        setStatus("none");
      }
    };
    checkStatus();
  }, [userId, friendId]);

  const handleSendRequest = async () => {
    try {
      await sendRequest(userId, friendId);
      setStatus("pending");
    } catch (err) {
      console.error("Failed to send friend request", err);
    }
  };

  return (
    <div>
      <button
        onClick={handleSendRequest}
        className="mt-10 inline-block cursor-pointer rounded-full bg-blue-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-blue-600"
      >
        Add Friend
      </button>
    </div>
  );
};

export default FriendRequestButton;
