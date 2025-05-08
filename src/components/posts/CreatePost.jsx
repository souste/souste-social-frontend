import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../../api/post";
import { useAuth } from "../../context/AuthContext";

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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const postData = {
        ...post,
        user_id: currentUser?.id || 15,
      };
      await createPost(postData, image);
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      navigate("/");
    } catch (err) {
      console.error("Failed to create post", err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Create Post
      </h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <div className="mb-3 flex flex-col gap-2 sm:items-center">
          <label
            htmlFor="content"
            className="text-sm font-semibold text-gray-700"
          >
            Your Post:
          </label>
          <textarea
            name="content"
            id="content"
            value={post.content}
            onChange={handleChange}
            required
            className="min-h-32 w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
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
              ></button>
            </div>
          )}
          <div>
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSubmitting}
              />
              Add Image
            </label>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
        >
          {isSubmitting ? "Creating..." : "Create Post"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="rounded-full border bg-red-300 px-3 py-3 font-semibold text-white hover:bg-red-200"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
