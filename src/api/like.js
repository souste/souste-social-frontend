export const likePost = async (postId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/like`,
      {
        method: "POST",
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
      },
    );
    if (!response.ok) {
      throw new Error("Could not unlike post");
    }
    console.log(`Like removed successfully from post ${postId}`);
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
    );
    if (!response.ok) {
      throw new Error("Could not count likes for this post");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error counting likes for this post", err.message);
  }
};
