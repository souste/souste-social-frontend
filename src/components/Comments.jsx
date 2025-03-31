import { useState, useEffect } from "react";
import { getComments } from "../api/comment";
import { useParams } from "react-router-dom";
import CreateComment from "./CreateComment";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { postId } = useParams();

  useEffect(() => {
    getComments(postId).then((comments) => {
      setComments(comments);
      setLoading(false);
    });
  }, [postId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Unknown time";
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return loading ? (
    <p className="mt-40 text-center text-xl font-semibold">
      The Comments are loading...
    </p>
  ) : (
    <div className="mt-5 space-y-3">
      <h1 className="text-xl">Comments</h1>
      <CreateComment />
      <ul className="space-y-3">
        {comments.map((comment) => {
          return (
            <li
              key={comment.id}
              className="space-y-3 bg-gray-300 p-4"
            >
              <p>{comment.content}</p>
              <p>
                By <strong>{comment.username}</strong> posted on{" "}
                {formatTimestamp(comment.created_at)}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Comments;
