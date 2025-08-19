import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../api/post";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft } from "lucide-react";

const CreatePost = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState({
    content: "",
    user_id: "",
    image: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const postData = {
        ...post,
        user_id: currentUser?.id,
      };
      await createPost(postData, image);
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      setPost({ content: "" });
      setImage(null);
      setPreview(null);
      navigate("/");
    } catch (err) {
      console.error("Failed to create post", err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-stone-800 dark:bg-stone-900">
      <button
        onClick={() => navigate("/")}
        className="mb-4 inline-flex items-center gap-2 rounded-md px-2 py-1 text-stone-600 transition hover:bg-stone-100 hover:text-stone-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Timeline
      </button>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-stone-100">
        Create a Post
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <textarea
          name="content"
          rows="5"
          id="content"
          value={post.content}
          onChange={handleChange}
          placeholder="What's on your mind?"
          required
          className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
        />

        {preview && (
          <div className="space-y-2">
            <img
              src={preview}
              alt="Preview"
              className="max-h-[50vh] w-full object-contain"
            />
            <button
              type="button"
              onClick={removeImage}
              disabled={isSubmitting}
              className="mt-2 rounded bg-red-500 px-3 py-1 text-sm text-white transition hover:bg-red-600 disabled:bg-red-300"
            >
              Remove Image
            </button>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-stone-200">
            Upload an image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700 dark:text-stone-300"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
