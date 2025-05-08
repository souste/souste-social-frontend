import { useState, useEffect } from "react";
import { getPendingRequests } from "../../api/friend";
import { acceptRequest, rejectRequest } from "../../api/friend";
import { createNotification } from "../../api/notification";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PendingRequestList = () => {
  const { currentUser } = useAuth();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const requests = await getPendingRequests(currentUser.id);
        setPendingRequests(requests || []);
      } catch (err) {
        console.error("Error fetching pending requests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPendingRequests();
  }, [currentUser]);

  const handleAccept = async (event, friendId) => {
    event.preventDefault();
    event.stopPropagation();

    if (actionInProgress === friendId) return;

    try {
      setActionInProgress(friendId);
      await acceptRequest(currentUser.id, friendId);

      const notification = {
        type: "friend_accept",
        referenceId: currentUser.id,
        message: `${currentUser.username} accepted your friend request`,
      };
      await createNotification(friendId, notification);

      setPendingRequests(
        pendingRequests.filter((request) => request.id !== friendId),
      );
    } catch (err) {
      console.error("Failed to accept request", err);
    } finally {
      setActionInProgress(null);
    }
  };

  const handleReject = async (event, friendId) => {
    event.preventDefault();
    event.stopPropagation();

    if (actionInProgress === friendId) return;

    try {
      setActionInProgress(friendId);
      await rejectRequest(currentUser.id, friendId);

      setPendingRequests(
        pendingRequests.filter((request) => request.id !== friendId),
      );
    } catch (err) {
      console.error("Failed to reject request", err);
    } finally {
      setActionInProgress(null);
    }
  };

  if (loading) {
    return (
      <div className="py-4 text-center text-gray-500">
        Loading pending requests...
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    <div className="py-4 text-center text-gray-500">
      No pending friend requests
    </div>;
  }

  return (
    <div className="mt-4">
      <h3 className="mb-3 text-lg font-semibold">Pending Friend Requests</h3>
      <ul className="space-y-3">
        {pendingRequests.map((request) => {
          return (
            <li key={request.id}>
              <Link
                to={`/profile/${request.id}`}
                className="flex cursor-pointer items-center gap-2 p-4 transition-colors hover:bg-gray-50"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex-shrink-0">
                  <img
                    src={request.picture}
                    alt={`${request.username}'s profile`}
                    className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                  />
                </div>
                <div className="text-sm font-medium text-gray-900">
                  <p>
                    {request.first_name} {request.last_name}
                  </p>
                </div>
                <button
                  onClick={(event) => handleAccept(event, request.id)}
                  disabled={actionInProgress === request.id}
                  className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-blue-600"
                >
                  {actionInProgress === request.id ? "..." : "Accept"}
                </button>
                <button
                  onClick={(event) => handleReject(event, request.id)}
                  disabled={actionInProgress === request.id}
                  className="rounded-md bg-gray-200 px-3 py-1 text-sm text-gray-800 transition-colors duration-200 hover:bg-gray-300"
                >
                  {actionInProgress === request.id ? "..." : "Decline"}
                </button>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PendingRequestList;
