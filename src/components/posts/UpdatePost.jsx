import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updatePost, getSinglePost, uploadPostImage } from "../../api/post";
import UploadPostImage from "./UploadPostImage";

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
    <div className="mx-auto max-w-lg px-4 py-6">
      <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Edit Post
      </h1>
      <UploadPostImage
        currentImage={post.image}
        setImageFile={setImageFile}
      />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <label
          htmlFor="content"
          className="text-sm font-semibold text-gray-700"
        >
          Edit Post:
        </label>
        <textarea
          name="content"
          id="content"
          value={post.content}
          onChange={handleChange}
          className="min-h-32 w-full resize-y rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 shadow-sm transition duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full border bg-red-600 px-3 py-3 font-semibold text-white hover:bg-red-700"
        >
          {"Edit Post"}
        </button>
      </form>
      <div className="mt-6 flex justify-center gap-6">
        <button
          onClick={() => navigate(`/posts/${postId}`)}
          className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-gray-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default UpdatePost;
