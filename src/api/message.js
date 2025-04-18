export const getConversation = async (userId, friendId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/messages/${userId}/conversation/${friendId}`,
    );
    if (!response.ok) {
      throw new Error("Could not fetch conversation");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching conversation", err.message);
    return [];
  }
};
