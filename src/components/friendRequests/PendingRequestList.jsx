import { useState, useEffect } from "react";
import { getPendingRequests } from "../../api/friend";
import { acceptRequest, rejectRequest } from "../../api/friend";
import { Link } from "react-router-dom";

const PendingRequestList = ({ userId }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const pendingRequests = await getPendingRequests(userId);
        setPendingRequests(pendingRequests);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };
    fetchPendingRequests();
  }, [userId]);

  const handleAcceptRequest = async (event, friendId) => {
    event.preventDefault();
    event.stopPropogation();
    try {
      setLoadingStates((prev) => ({ ...prev, [friendId]: true }));
      await acceptRequest(userId, friendId);
      alert("Friend request accepted");
      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== friendId),
      );
    } catch (err) {
      console.error("Failed to accept friend request", err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [friendId]: false }));
    }
  };

  const handleRejectRequest = async (event, friendId) => {
    event.preventDefault();
    event.stopPropogation();
    try {
      setLoadingStates((prev) => ({ ...prev, [friendId]: true }));
      await rejectRequest(userId, friendId);
      alert("Friend request rejected");
      setPendingRequests((prev) =>
        prev.filter((request) => request.id !== friendId),
      );
    } catch (err) {
      console.error("Failed to reject friend request", err);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [friendId]: false }));
    }
  };

  return loading ? (
    <div>
      <p>Pending Request List is Loading</p>
    </div>
  ) : (
    <div className="divide-y divide-gray-100">
      <h1>Pending Requests</h1>
      <ul>
        {pendingRequests.map((pendingRequest) => {
          return (
            <Link
              key={pendingRequest.id}
              to={`/profile/${pendingRequest.id}`}
              className="flex cursor-pointer items-center gap-2 p-4 transition-colors hover:bg-gray-50"
            >
              <div className="flex-shrink-0">
                <img
                  src={pendingRequest.picture}
                  alt={`${pendingRequest.first_name}'s pendingRequest picture`}
                  className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                />
              </div>
              <div className="text-sm font-medium text-gray-900">
                <p>
                  {pendingRequest.first_name} {pendingRequest.last_name}
                </p>
              </div>
              <button
                onClick={() => handleAcceptRequest(pendingRequest.id)}
                className="mt-10 inline-block cursor-pointer rounded-full bg-blue-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-blue-600"
                disabled={loadingStates[pendingRequest.id]}
              >
                Confirm
              </button>
              <button
                onClick={() => handleRejectRequest(pendingRequest.id)}
                className="mt-10 inline-block cursor-pointer rounded-full bg-rose-500 px-4 py-3 font-semibold tracking-wide text-white uppercase transition-colors duration-300 hover:bg-rose-600"
                disabled={loadingStates[pendingRequest.id]}
              >
                Reject
              </button>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default PendingRequestList;
