import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePost, getSinglePost, uploadPostImage } from "../../api/post";
import UploadPostImage from "./UploadPostImage";
import { ArrowLeft, Edit } from "lucide-react";

const UpdatePost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [post, setPost] = useState({
    content: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getSinglePost(postId);
        setPost({ content: post.content, image: post.image });
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };
    fetchPost();
  }, [postId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      if (imageFile) {
        const imageResult = await uploadPostImage(postId, imageFile);
        if (imageResult && imageResult.image) {
          post.image = imageResult.image;
          setPost((prev) => ({
            ...prev,
            image: imageResult.image,
          }));
        } else {
          console.warn(
            "No valid image URL found in imageResult.imageUrl",
            imageResult,
          );
        }
      }
      const response = await updatePost(postId, post);
      if (response.errors) {
        setErrors(response.errors);
        setIsSubmitting(false);
        return;
      }
      navigate(`/posts/${postId}`);
    } catch (err) {
      console.error("Failed to update post", err);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="mx-auto max-w-xl px-6 py-6">
      <button
        onClick={() => navigate(`/posts/${postId}`)}
        className="mb-4 flex cursor-pointer items-center gap-2 text-gray-600 transition hover:text-gray-800"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Post
      </button>

      <h2 className="mb-4 text-2xl font-semibold text-gray-800">Edit Post</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <textarea
          name="content"
          rows="5"
          id="content"
          value={post.content}
          onChange={handleChange}
          className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />

        <UploadPostImage
          currentImage={post.image}
          setImageFile={setImageFile}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          <Edit className="h-5 w-5" />
          {isSubmitting ? "Saving..." : "Edit Post"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePost;
