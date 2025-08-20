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

      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== friendId),
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
      <div className="card muted p-4 text-center text-sm">
        Loading pending requests…
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="mt-4 space-y-3">
        <h3 className="inline-flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Friend Requests <span className="chip ml-2">0</span>
        </h3>
        <div className="card muted p-4 text-sm">No pending requests.</div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      <h3 className="inline-flex items-center text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Friend Requests
        <span className="chip ml-2">
          {pendingRequests.length > 99 ? "99+" : pendingRequests.length}
        </span>
      </h3>

      <div className="card overflow-hidden p-0">
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {pendingRequests.map((request) => {
            return (
              <li key={request.id}>
                <Link
                  to={`/profile/${request.id}`}
                  className="block transition-colors hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-600"
                  onClick={(event) => event.stopPropagation()}
                >
                  <div className="flex items-center gap-3 px-4 py-3">
                    <img
                      src={request.picture}
                      alt={`${request.username}'s profile`}
                      className="h-10 w-10 rounded-full border border-zinc-200 object-cover dark:border-zinc-700"
                    />
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      <p>
                        {request.first_name} {request.last_name}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 pb-3">
                    <div className="mt-1 flex gap-2">
                      <button
                        onClick={(event) => handleAccept(event, request.id)}
                        disabled={actionInProgress === request.id}
                        className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                      >
                        {actionInProgress === request.id ? "..." : "Accept"}
                      </button>
                      <button
                        onClick={(event) => handleReject(event, request.id)}
                        disabled={actionInProgress === request.id}
                        className="cursor-pointer rounded-md bg-red-500 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600"
                      >
                        {actionInProgress === request.id ? "..." : "Decline"}
                      </button>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PendingRequestList;
