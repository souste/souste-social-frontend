export const getCommentsByPost = async (postId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/comments`,
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
