import { useState, useEffect } from "react";

const UploadPostImage = ({ setImageFile }) => {
  const [preview, setPreview] = useState("");

  const currentImage = "";

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
    <div className="mb-8 flex flex-col items-center gap-4 rounded-lg border border-gray-300 bg-white p-6 shadow-sm">
      <h1 className="mb-2 text-lg font-semibold text-gray-800">Post Image</h1>

      <img
        src={preview || currentImage}
        alt="Preview"
        className="h-32 w-32 rounded-full border-2 border-gray-300 object-cover shadow"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-red-700"
      />
    </div>
  );
};

export default UploadPostImage;
