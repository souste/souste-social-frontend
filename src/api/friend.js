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
        headers: {
          "Content-Type": "application/json",
        },
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
