import { useState, useEffect } from "react";
// import { uploadProfileImage } from "../api/user";
// import { useAuth } from "../context/AuthContext";

const UploadProfileImage = ({ currentImage, imageFile, setImageFile }) => {
  //   const { currentUser } = useAuth();
  //   const userId = currentUser.id;

  //   const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (currentImage) {
      setPreview(currentImage);
    }
  }, [currentImage]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  //   const handleUpload = async () => {
  //     try {
  //       setIsUploading(true);
  //       const result = await uploadProfileImage(userId, imageFile);

  //       console.log("Upload Result", result);

  //       if (result && result.picture) {
  //         setProfile((prev) => ({ ...prev, picture: result.picture }));
  //         alert("Profile Image Updated");
  //       } else {
  //         alert("Failed to retrieve uploaded image URL");
  //       }
  //     } catch (err) {
  //       console.error("Failed to upload image, err");
  //     } finally {
  //       setIsUploading(false);
  //     }
  //   };

  return (
    <div className="mb-8 flex flex-col items-center gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <h2 className="mb-2 text-lg font-semibold text-gray-800">
        Profile Picture:
      </h2>

      <img
        src={preview || currentImage || "../assets/default-profile.JPG"}
        alt="Preview"
        className="h-32 w-32 rounded-full border-2 border-gray-300 object-cover shadow"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
      />
      {/* <button
        disabled={!imageFile || isUploading}
        onClick={handleUpload}
        className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload Image"}
      </button> */}
    </div>
  );
};

export default UploadProfileImage;
