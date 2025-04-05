import { useState } from "react";
import { uploadProfileImage } from "../api/user";
import { useAuth } from "../context/AuthContext";

const UploadProfileImage = () => {
  const { currentUser } = useAuth();
  const userId = currentUser.id;
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      await uploadProfileImage(userId, imageFile);
      alert("Profile Image Updated");
    } catch (err) {
      console.error("Failed to upload image, err");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2>Change Profile Picture</h2>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="mt-2 h-32 w-32 rounded-full object-cover"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button
        disabled={!imageFile || isUploading}
        onClick={handleUpload}
      >
        {isUploading ? "Uploading..." : "Upload Image"}
      </button>
    </div>
  );
};

export default UploadProfileImage;
