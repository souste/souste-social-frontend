const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getComments = async (postId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/comments`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error("Could not fetch comments");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching comments:", err.message);
    return [];
  }
};

export const getSingleComment = async (postId, commentId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/comments/${commentId}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not fetch comment");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching single comment", err.message);
    return {};
  }
};

export const createComment = async (postId, commentData) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/comments`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(commentData),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to create comment");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Create Comment Error", err);
  }
};

export const updateComment = async (postId, commentId, commentData) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/comments/${commentId}`,
      {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(commentData),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update comment");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Update Post error", err);
    throw err;
  }
};

export const deleteComment = async (postId, commentId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }
    return true;
  } catch (err) {
    console.error("Failed to delete comment", err);
    return false;
  }
};
