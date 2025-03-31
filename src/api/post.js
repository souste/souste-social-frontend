export const getPosts = async () => {
  try {
    const response = await fetch(
      "https://souste-social.onrender.com/api/v1/posts",
    );

    if (!response.ok) {
      throw new Error("Could not fetch posts");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    return [];
  }
};

export const getSinglePost = async (postId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}`,
    );

    if (!response.ok) {
      throw new Error("Could not fetch post");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching single post:", err.message);
    return {};
  }
};

export const createPost = async (postData) => {
  try {
    const response = await fetch(
      "https://souste-social.onrender.com/api/v1/posts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to create post");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Create Post Error", err);
    throw err;
  }
};
