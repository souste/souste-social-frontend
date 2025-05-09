const authHeaders = (useJson = true) => {
  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  if (useJson) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
};

export const getProfiles = async () => {
  try {
    const response = await fetch(
      "https://souste-social.onrender.com/api/v1/users/profile",
      {
        method: "GET",
        headers: authHeaders(),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Could not fetch profiles: ${response.status}`,
      );
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching profiles", err.message);
    throw err;
  }
};

export const getProfile = async (userId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/users/${userId}/profile`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Could not fetch profile: ${response.status}`,
      );
    }

    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error fetching profile", err.message);
    throw err;
  }
};

export const updateProfile = async (userId, profileData) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/users/${userId}/profile`,
      {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify(profileData),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update profile");
    }
    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const uploadProfileImage = async (userId, imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/users/${userId}/profile/image`,
      {
        method: "POST",
        headers: authHeaders(false),
        body: formData,
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message ||
          `Failed to upload profile image: ${response.status}`,
      );
    }

    const result = await response.json();
    return result.data;
  } catch (err) {
    console.error("Error uploading profile image", err);
    throw err;
  }
};
