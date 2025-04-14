import { useState, useEffect } from "react";
import { getPendingRequests } from "../api/friend";

const PendingRequestList = ({ userId }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const pendingRequests = await getPendingRequests(userId);
        console.log("fromPendingRequests", pendingRequests);
        setPendingRequests(pendingRequests);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };
    fetchPendingRequests();
  }, [userId]);

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
            <li
              key={pendingRequest.id}
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
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PendingRequestList;
