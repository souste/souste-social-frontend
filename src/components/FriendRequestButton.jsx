import { useState, useEffect } from "react";
import { sendRequest, getFriendStatus, cancelRequest } from "../api/friend";

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
      window.confirm("Friend Request Sent");
    } catch (err) {
      console.error("Failed to send friend request", err);
    }
  };

  const handleCancelRequest = async () => {
    try {
      await cancelRequest(userId, friendId);
      setStatus("none");
      window.confirm("Friend Request Cancelled");
    } catch (err) {
      console.error("Failed to cancel friend request", err);
    }
  };

  return (
    <div>
      {status === "none" && (
        <button
          onClick={handleSendRequest}
          className="mt-10 inline-block cursor-pointer rounded-full bg-blue-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-blue-600"
        >
          Add Friend
        </button>
      )}
      {status === "pending" && (
        <button
          onClick={handleCancelRequest}
          className="mt-10 inline-block cursor-pointer rounded-full bg-rose-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-rose-600"
        >
          Cancel Request
        </button>
      )}
    </div>
  );
};

export default FriendRequestButton;
