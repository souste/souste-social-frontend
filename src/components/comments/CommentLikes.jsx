import { useState, useEffect } from "react";
import { likeComment, unlikeComment, countCommentLikes } from "../../api/like";
import { Heart, HeartOff } from "lucide-react";

const CommentLikes = ({ postId, commentId }) => {
  const [count, setCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count, likedByUser } = await countCommentLikes(
          postId,
          commentId,
        );
        setCount(count);
        setIsLiked(likedByUser);
      } catch (err) {
        console.error("Failed to fetch comment count", err);
      }
    };
    fetchCount();
  }, [postId, commentId]);

  const handleChange = async () => {
    try {
      if (isLiked) {
        await unlikeComment(postId, commentId);
        setIsLiked(false);
      } else {
        await likeComment(postId, commentId);
        setIsLiked(true);
      }
      const { count: updatedCount } = await countCommentLikes(
        postId,
        commentId,
      );
      setCount(updatedCount);
    } catch (err) {
      console.error("Failed to like comment", err);
    }
  };

  return (
    <div className="p-2">
      <h1>Comment Likes</h1>
      <div>
        <button
          onClick={handleChange}
          className="flex items-center gap-2 rounded border px-3 py-1 transition hover:bg-gray-100"
        >
          {" "}
          {isLiked ? (
            <>
              <HeartOff className="h-5 w-5 text-red-500" />
              Unlike
            </>
          ) : (
            <>
              <Heart className="h-5 w-5 text-gray-500" />
              Like
            </>
          )}
        </button>
        <div>Count: {count}</div>
      </div>
    </div>
  );
};

export default CommentLikes;
