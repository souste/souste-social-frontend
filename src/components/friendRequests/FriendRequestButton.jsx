import { useState, useEffect } from "react";
import {
  sendRequest,
  getFriendStatus,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  unfriend,
} from "../../api/friend";
import { createNotification } from "../../api/notification";
import { useAuth } from "../../context/AuthContext";
import socket from "../../../socket";

const FriendRequestButton = ({ friendId }) => {
  const { currentUser } = useAuth();
  const [friendshipState, setFriendshipState] = useState({
    status: "none",
    direction: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const userId = currentUser.id;

  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (userId && friendId) {
          const result = await getFriendStatus(userId, friendId);
          setFriendshipState(result);
        }
      } catch (err) {
        console.error("Failed to check friendship status", err);
        setFriendshipState({ status: "none", direction: null });
      }
    };
    checkStatus();
  }, [userId, friendId]);

  const handleSendRequest = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await sendRequest(userId, friendId);
      setFriendshipState({ status: "pending", direction: "sent" });
      const notification = {
        recipientId: friendId,
        senderId: userId,
        type: "friend_request",
        referenceId: userId,
        message: `${currentUser.username} sent you a friend request`,
      };
      socket.emit("send notification", notification);
      // await createNotification(friendId, notification);
    } catch (err) {
      console.error("Failed to send friend request", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await acceptRequest(userId, friendId);
      setFriendshipState({ status: "accepted", direction: null });
      const notification = {
        recipientId: friendId,
        senderId: userId,
        type: "friend_accept",
        referenceId: userId,
        message: `${currentUser.username} accepted your friend request`,
      };
      socket.emit("send notification", notification);
      // await createNotification(friendId, notification);
    } catch (err) {
      console.error("Failed to accept friend request", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectRequest = async () => {
    if (isLoading) return;
    try {
      setIsLoading(false);
      await rejectRequest(userId, friendId);
      setFriendshipState({ status: "rejected", direction: null });
    } catch (err) {
      console.error("Failed to reject friend request", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await cancelRequest(userId, friendId);
      setFriendshipState({ status: "none", durection: null });
    } catch (err) {
      console.error("Failed to cancel friend request", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfriend = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await unfriend(userId, friendId);
      setFriendshipState({ status: "none", durection: null });
    } catch (err) {
      console.error("Failed to unfriend user", err);
    } finally {
      setIsLoading(false);
    }
  };

  const { status, direction } = friendshipState;

  if (status === "none" || status === "rejected") {
    return (
      <button
        onClick={handleSendRequest}
        className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-400"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Add Friend"}
      </button>
    );
  }

  if (status === "pending") {
    if (direction === "sent") {
      return (
        <button
          onClick={handleCancelRequest}
          className="rounded-full bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Cancel Request"}
        </button>
      );
    }
    if (direction === "received") {
      return (
        <div className="flex gap-2">
          <button
            onClick={handleAcceptRequest}
            className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-400"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Accept"}
          </button>
          <button
            onClick={handleRejectRequest}
            className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-400"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Decline"}
          </button>
        </div>
      );
    }
    return <p>Loading...</p>;
  }

  if (status === "accepted") {
    return (
      <button
        onClick={handleUnfriend}
        className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-400"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Unfriend"}
      </button>
    );
  }

  return null;
};

export default FriendRequestButton;
