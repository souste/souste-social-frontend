import { useState, useEffect } from "react";
import { likeComment, unlikeComment, countCommentLikes } from "../../api/like";
import { createNotification } from "../../api/notification";
import { Heart, HeartOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const CommentLikes = ({ postId, commentId, commentUserId }) => {
  const [count, setCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { currentUser } = useAuth();

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
        const notification = {
          type: "like_comment",
          referenceId: commentId,
          message: `${currentUser.username} liked your comment`,
        };
        await createNotification(commentUserId, notification);
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
