import { useState, useEffect } from "react";

const UploadPostImage = ({ currentImage, setImageFile }) => {
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
    <div className="flex flex-col items-start gap-4 rounded-lg border border-stone-200 bg-white p-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <img
        src={preview || currentImage}
        alt="Preview"
        className="mb-2 max-h-64 w-full rounded-md bg-stone-100 object-contain ring-1 ring-stone-200 dark:bg-stone-800 dark:ring-stone-700"
      />

      <label className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-200">
        Change Image (Optional)
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-stone-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700 dark:text-stone-300"
      />
    </div>
  );
};

export default UploadPostImage;
