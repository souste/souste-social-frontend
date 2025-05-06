import { useState, useEffect } from "react";
import {
  sendRequest,
  getFriendStatus,
  acceptRequest,
  cancelRequest,
  unfriend,
} from "../../api/friend";
import { createNotification } from "../../api/notification";
import { useAuth } from "../../context/AuthContext";

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
      const notification = {
        type: "friend_request",
        referenceId: friendId,
        message: `${currentUser.username} sent you a friend request`,
      };
      await createNotification(friendId, notification);
      alert("Friend Request Sent");
    } catch (err) {
      console.error("Failed to send friend request", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    try {
      setIsLoading(true);
      await acceptRequest(userId, friendId);
      // const notification = {
      //   type: "friend_accept",
      //   referenceId: friendId,
      //   message: `${currentUser.username} accepted your friend request`,
      // };
      // await createNotification(friendId, notification);
      alert("Friend request accepted");
      // setPendingRequest api call here??
    } catch (err) {
      console.error("Failed to accept friend request", err);
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

  const handleUnfriend = async () => {
    try {
      setIsLoading(true);
      await unfriend(userId, friendId);
      setStatus("none");
      alert("Unfriended user successfully");
    } catch (err) {
      console.error("Failed to unfriend user", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {(status === "none" || status === "rejected") && (
        <button
          onClick={handleSendRequest}
          className="mt-10 inline-block cursor-pointer rounded-full bg-blue-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-blue-600"
          disabled={isLoading}
        >
          Add Friend
        </button>
      )}
      {status === "pending" && (
        <div>
          <button
            onClick={handleAcceptRequest}
            className="mt-10 inline-block cursor-pointer rounded-full bg-blue-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-blue-600"
            disabled={isLoading}
          >
            Accept Friend
          </button>
          <button
            onClick={handleCancelRequest}
            className="mt-10 inline-block cursor-pointer rounded-full bg-rose-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-rose-600"
            disabled={isLoading}
          >
            Cancel Request
          </button>
        </div>
      )}
      {status === "accepted" && (
        <button
          onClick={handleUnfriend}
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
