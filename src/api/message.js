const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getConversations = async (userId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/messages/${userId}/conversation`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not fetch conversations");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching conversations", err.message);
  }
};

export const getConversation = async (userId, friendId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/messages/${userId}/conversation/${friendId}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
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

export const getSingleMessage = async (userId, messageId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/messages/${userId}/message/${messageId}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not fetch message");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching comment", err.message);
    return {};
  }
};

export const createMessage = async (userId, friendId, messageData) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/messages/${userId}/conversation/${friendId}`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(messageData),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to create message");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Create Message Error", err);
    throw err;
  }
};

export const updateMessage = async (userId, messageId, messageData) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/messages/${userId}/message/${messageId}`,
      {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(messageData),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update message");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Update message error", err);
    throw err;
  }
};

export const deleteMessage = async (userId, messageId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/messages/${userId}/message/${messageId}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to delete message");
    }
    return true;
  } catch (err) {
    console.error("Delete Message Error", err);
    return false;
  }
};
