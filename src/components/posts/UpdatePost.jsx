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
        className="-mx-2 mb-4 inline-flex items-center gap-2 rounded-md px-2 py-1 text-stone-600 transition hover:bg-stone-100 hover:text-stone-800 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-stone-100"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Post
      </button>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <header className="border-b border-gray-100 p-6 dark:border-stone-800">
          <h2 className="text-2xl font-semibold text-stone-800 dark:text-stone-100">
            Edit Post
          </h2>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 p-6"
        >
          <textarea
            name="content"
            rows="5"
            id="content"
            value={post.content}
            onChange={handleChange}
            className="w-full resize-none rounded-lg border border-gray-300 p-3 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100 dark:placeholder-stone-500 dark:focus:border-blue-500 dark:focus:ring-blue-900/40"
          />

          <UploadPostImage
            currentImage={post.image}
            setImageFile={setImageFile}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:opacity-60"
          >
            <Edit className="h-5 w-5" />
            {isSubmitting ? "Saving..." : "Edit Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;
