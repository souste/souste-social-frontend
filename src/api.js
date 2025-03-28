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

export const createUser = async (userData) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/auth/sign-up`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return { errors: result.errors || [{ msg: "Unknown error occurred" }] };
    }

    return result;
  } catch (err) {
    console.error("User creation error:", err.message);
    throw err;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      },
    );
    const result = await response.json();

    if (!response.ok) {
      return { errors: result.errors || [{ msg: "Unknown error occurred" }] };
    }

    return result;
  } catch (err) {
    console.error("Login error", err.message);
    throw err;
  }
};
