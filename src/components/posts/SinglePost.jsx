import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getSinglePost, deletePost } from "../../api/post";
import Comments from "../comments/Comments";
import PostLikes from "../posts/PostLikes";

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
        console.error("Failed to fetch post", err);
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
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="animate-pulse text-center">
        <p className="text-xl font-semibold text-red-600">Loading post...</p>
      </div>
    </div>
  ) : (
    <div>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="overflow-hidden rounded-lg bg-white shadow-md">
          <div>
            <div className="p-6">
              <div className="mb-6 text-lg whitespace-pre-wrap text-stone-800">
                {singlePost.content}
              </div>

              <div className="flex items-center justify-between border-t pt-4 text-sm text-stone-500">
                <div>
                  By{" "}
                  <span className="font-medium text-red-600">
                    {singlePost.username}
                  </span>
                </div>
                <div>{formatTimestamp(singlePost.created_at)}</div>
              </div>

              <PostLikes postId={singlePost.id} />

              <div className="mt-6 flex justify-center gap-6">
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
          </div>
        </div>
        <div className="mt-6 flex justify-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-gray-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-gray-300"
          >
            Back
          </button>
        </div>

        <Comments post={singlePost} />
      </div>
    </div>
  );
};

export default SinglePost;
