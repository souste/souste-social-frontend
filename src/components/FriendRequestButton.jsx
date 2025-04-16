import { useState, useEffect } from "react";
import {
  sendRequest,
  getFriendStatus,
  cancelRequest,
  unfriend,
} from "../api/friend";
import { useAuth } from "../context/AuthContext";

const FriendRequestButton = ({ friendId }) => {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState("none");
  const [isLoading, setIsLoading] = useState(false);
  const userId = currentUser.id;

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
      setIsLoading(true);
      await sendRequest(userId, friendId);
      setStatus("pending");
      alert("Friend Request Sent");
    } catch (err) {
      console.error("Failed to send friend request", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    try {
      setIsLoading(true);
      await cancelRequest(userId, friendId);
      setStatus("none");
      alert("Friend Request Cancelled");
    } catch (err) {
      console.error("Failed to cancel friend request", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {status === "none" && (
        <button
          onClick={handleSendRequest}
          className="mt-10 inline-block cursor-pointer rounded-full bg-blue-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-blue-600"
          disabled={isLoading}
        >
          Add Friend
        </button>
      )}
      {status === "pending" && (
        <button
          onClick={handleCancelRequest}
          className="mt-10 inline-block cursor-pointer rounded-full bg-rose-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-rose-600"
          disabled={isLoading}
        >
          Cancel Request
        </button>
      )}
      {status === "accepted" && (
        <button
          onClick={handleCancelRequest}
          className="mt-10 inline-block cursor-pointer rounded-full bg-rose-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-rose-600"
          disabled={isLoading}
        >
          Unfriend
        </button>
      )}
    </div>
  );
};

export default FriendRequestButton;
