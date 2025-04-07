export const getProfile = async (userId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/users/${userId}/profile`,
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
        headers: {
          "Content-Type": "application/json",
        },
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
    console.log("API response", result);

    return result.data;
  } catch (err) {
    console.error("Error uploading profile image", err);
    throw err;
  }
};
