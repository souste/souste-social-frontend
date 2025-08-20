import { useState, useEffect } from "react";

const UploadProfileImage = ({ currentImage, setImageFile }) => {
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

  return (
    <div className="mb-8 flex flex-col items-center gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <p className="mb-2 text-sm font-medium text-stone-700 dark:text-stone-200">
        Profile Picture:
      </p>

      <img
        src={preview || currentImage || "../assets/default-profile.JPG"}
        alt="Preview"
        className="h-32 w-32 rounded-full border-2 border-stone-300 object-cover shadow dark:border-stone-700"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-stone-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700 dark:text-stone-300"
      />
    </div>
  );
};

export default UploadProfileImage;
