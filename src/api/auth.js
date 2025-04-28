export const signupUser = async (userData) => {
  try {
    const response = await fetch(
      "https://souste-social.onrender.com/api/v1/auth/sign-up",
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
      "https://souste-social.onrender.com/api/v1/auth/login",
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
    if (result.data.token) {
      localStorage.setItem("token", result.data.token);
    }

    return result;
  } catch (err) {
    console.error("Login error", err.message);
    throw err;
  }
};
