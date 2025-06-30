const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getAllNotifications = async (recipientId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/notifications/${recipientId}`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not fetch notifications");
    }
    const result = await response.json();
    return result.notifications;
  } catch (err) {
    console.error("Error fetching notifications", err.message);
    return [];
  }
};

export const getUnreadNotifications = async (recipientId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/notifications/${recipientId}/unread`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not fetch unread notifications");
    }
    const result = await response.json();
    return result.notifications;
  } catch (err) {
    console.error("Error fetching unread notifications", err.message);
    return [];
  }
};

export const getReadNotifications = async (recipientId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/notifications/${recipientId}/read`,
      {
        method: "GET",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Could not fetch read notifications");
    }
    const result = await response.json();
    return result.notifications;
  } catch (err) {
    console.error("Error fetching read notifications", err.message);
    return [];
  }
};

export const createNotification = async (recipientId, notificationData) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/notifications/${recipientId}`,
      {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(notificationData),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to create notification");
    }
    const result = await response.json();
    return result.notification;
  } catch (err) {
    console.error("Error creating notification", err);
  }
};

export const readNotification = async (notificationId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/notifications/${notificationId}/read`,
      {
        method: "PATCH",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update notification to read");
    }
    const result = await response.json();
    return result.notification;
  } catch (err) {
    console.error("Error updating notification to read", err);
  }
};

export const readAllNotifications = async (recipientId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/notifications/${recipientId}/read-all`,
      {
        method: "PATCH",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to update all notifications to read");
    }
    const result = await response.json();
    return result.notifications;
  } catch (err) {
    console.error("Error updating all notifications to read", err);
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/notifications/${notificationId}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to delete notification");
    }
    return true;
  } catch (err) {
    console.error("Delete Notification Error", err);
    return false;
  }
};

export const deleteAllNotifications = async (recipientId) => {
  try {
    const response = await fetch(
      `https://souste-social.onrender.com/api/v1/notifications/user/${recipientId}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error("Failed to delete all notifications");
    }
    return true;
  } catch (err) {
    console.error("Delete Notification Error", err);
    return false;
  }
};
