import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getSinglePost } from "../api";
import Comments from "./Comments";

const SinglePost = () => {
  const [singlePost, setSinglePost] = useState({});
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getSinglePost(postId).then((post) => {
      setSinglePost(post);
      setLoading(false);
    });
  }, [postId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown Time";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
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
        </div>
        <Comments />
        <button
          onClick={() => navigate("/")}
          className="hover: focus:-red-300 mt-10 inline-block cursor-pointer rounded-full bg-red-400 px-4 py-3 font-semibold tracking-wide text-stone-800 uppercase transition-colors duration-300 hover:bg-red-300"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default SinglePost;
