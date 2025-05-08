const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getPosts = async () => {
  try {
    const response = await fetch(
      "https://souste-social.onrender.com/api/v1/posts",
      {
        method: "GET",
        headers: authHeaders(),
      },
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

export const getFriendsPosts = async (userId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/friends/${userId}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error("Could not fetch friend's posts");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching friend's posts", err.message);
    return [];
  }
};

export const getOwnPosts = async (userId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/own/${userId}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error("Could not fetch user's own posts");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching user's own posts", err.message);
  }
};

export const getSinglePost = async (postId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
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

export const createPost = async (postData, imageFile = null) => {
  try {
    let body;
    let headers = authHeaders();

    if (imageFile) {
      const formData = new FormData();

      formData.append("content", postData.content || "");
      formData.append("user_id", postData.user_id);
      formData.append("image", imageFile);
      delete headers["Content-Type"];

      body = formData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(postData);
    }

    const response = await fetch(
      "https://souste-social.onrender.com/api/v1/posts",
      {
        method: "POST",
        headers: headers,
        body: body,
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create post");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Create Post Error", err);
    throw err;
  }
};

export const updatePost = async (postId, postData) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}`,
      {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(postData),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update post");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Update Post error", err);
    throw err;
  }
};

export const deletePost = async (postId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    console.log(`Post ${postId} deleted successfully`);
    return true;
  } catch (err) {
    console.error("Failed to delete post", err);
    return false;
  }
};

export const uploadPostImage = async (postId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/posts/${postId}/image`,
      {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Failed to upload post image ${response.status}`,
      );
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error uploading post image", err);
    throw err;
  }
};
