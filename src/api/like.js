const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const likePost = async (postId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/like`,
      {
        method: "POST",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not like post");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Like Post Error");
    throw err;
  }
};

export const unlikePost = async (postId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/unlike`,
      {
        method: "DELETE",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not unlike post");
    }

    return true;
  } catch (err) {
    console.error("Failed to unlike post", err);
    return false;
  }
};
export const countPostLikes = async (postId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/likes/count`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not count likes for this post");
    }
    const result = await response.json();

    return {
      count: result.count,
      likedByUser: result.likedByUser,
    };
  } catch (err) {
    console.error(`Error counting likes for post ${postId}`, err.message);
    return { count: 0, likedByUser: false };
  }
};

export const likeComment = async (postId, commentId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/comments/${commentId}/like`,
      {
        method: "POST",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not like comment");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Like Comment Error");
    throw err;
  }
};

export const unlikeComment = async (postId, commentId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/comments/${commentId}/unlike`,
      {
        method: "DELETE",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not unlike comment");
    }

    return true;
  } catch (err) {
    console.error("Failed to unlike comment", err);
    return false;
  }
};
export const countCommentLikes = async (postId, commentId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/comments/${commentId}/likes/count`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not count likes for this comment");
    }
    const result = await response.json();
    return {
      count: result.count,
      likedByUser: result.likedByUser,
    };
  } catch (err) {
    console.error(`Error counting likes for comment ${commentId}`, err.message);
    return { count: 0, likedByUser: false };
  }
};
