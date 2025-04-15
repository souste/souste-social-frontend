export const getFriendStatus = async (userId, friendId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/friendRequest/${userId}/status/${friendId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch friendship status");
    }
    const result = await response.json();
    return result.status;
  } catch (err) {
    console.error("Error fetching friend status");
    return "none";
  }
};

export const sendRequest = async (userId, friendId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/friendRequest/${userId}/send/${friendId}`,
      {
        method: "POST",
      },
    );
    if (!response.ok) {
      throw new Error("Failed to send friend request");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error sending friend request", err.message);
  }
};

export const cancelRequest = async (userId, friendId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/friendRequest/${userId}/cancel/${friendId}`,
      {
        method: "DELETE",
      },
    );
    if (!response.ok) {
      throw new Error("Failed to cancel friend request");
    }

    const data = await response.json();
    console.log(
      `Friend request from user ${userId} to friend ${friendId} cancelled successfully`,
    );
    return data;
  } catch (err) {
    console.error("Failed to cancel friend request", err);
    return false;
  }
};

export const acceptRequest = async (userId, friendId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/friendRequest/${userId}/accept/${friendId}`,
      {
        method: "PATCH",
      },
    );
    if (!response.ok) {
      throw new Error("Failed to accept friend request");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error accepting friend request", err.message);
  }
};

export const rejectRequest = async (userId, friendId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/friendRequest/${userId}/reject/${friendId}`,
      {
        method: "PATCH",
      },
    );
    if (!response.ok) {
      throw new Error("Failed to reject friend request");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error rejecting friend request", err.message);
  }
};

export const getFriends = async (userId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/friendRequest/${userId}/friends`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch friends");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching friends", err.message);
    return [];
  }
};

export const getPendingRequests = async (userId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/friendRequest/${userId}/pending`,
    );
    console.log("response from api", response);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Could not fetch pending requests: ${response.status}`,
      );
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching pending requests", err.message);
    return [];
  }
};
