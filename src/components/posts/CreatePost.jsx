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
    <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-md">
      <button
        onClick={() => navigate("/")}
        className="mb-4 flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-gray-800"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Timeline
      </button>
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
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
          className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />

        {preview && (
          <div>
            <img
              src={preview}
              alt="Preview"
            />
            <button
              type="button"
              onClick={removeImage}
              disabled={isSubmitting}
              className="mt-2 rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 disabled:bg-red-300"
            >
              Remove Image
            </button>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Upload an image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isSubmitting}
            ref={fileInputRef}
            className="block w-full text-sm text-gray-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 sm:w-auto"
        >
          {isSubmitting ? "Posting..." : "Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
