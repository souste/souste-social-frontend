import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getSinglePost, deletePost } from "../api/post";
import Comments from "./Comments";

const SinglePost = () => {
  const [singlePost, setSinglePost] = useState({});
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getSinglePost(postId);
        setSinglePost(post);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch post");
      }
    };
    fetchPost();
  }, [postId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown Time";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone",
    );

    if (!confirmDelete) return;

    const success = await deletePost(postId);
    if (success) {
      navigate("/");
    }
  };

  return loading ? (
    <p className="mt-40 text-center text-xl font-semibold">
      The Post is loading...
    </p>
  ) : (
    <div>
      <div className="mx-auto mt-20 max-w-xl text-center">
        <div className="w-full space-y-3 bg-red-200 p-4 text-xl font-semibold text-stone-700">
          <h3>{singlePost.content}</h3>
          <p>
            By <strong>{singlePost.username}</strong> posted on:{" "}
            {formatTimestamp(singlePost.created_at)}
          </p>
          <div className="mt-6 flex justify-center gap-6">
            <button
              onClick={() => navigate("/")}
              className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-gray-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-gray-300"
            >
              Back
            </button>
            <button
              onClick={() => navigate(`/posts/${postId}/edit-post`)}
              className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-red-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(postId)}
              className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-red-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
            >
              Delete
            </button>
          </div>
        </div>

        <Comments />
      </div>
    </div>
  );
};

export default SinglePost;
