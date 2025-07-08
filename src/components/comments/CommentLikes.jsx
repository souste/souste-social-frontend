import { useState, useEffect } from "react";
import { likeComment, unlikeComment, countCommentLikes } from "../../api/like";
// import { createNotification } from "../../api/notification";
import { Heart, HeartOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import socket from "../../../socket";

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

        if (commentUserId !== currentUser.id) {
          const notification = {
            recipientId: commentUserId,
            senderId: currentUser.id,
            type: "like_comment",
            referenceId: commentId,
            message: `${currentUser.username} liked your comment`,
          };
          socket.emit("send notification", notification);
          // await createNotification(commentUserId, notification);
        }
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
    <div className="flex items-center gap-2">
      <button
        onClick={handleChange}
        aria-label={isLiked ? "Unlike comment" : "Like comment"}
        className="flex items-center gap-1 text-sm text-gray-600 transition hover:text-red-500"
      >
        {isLiked ? (
          <HeartOff className="h-5 w-5 text-red-500" />
        ) : (
          <Heart className="h-5 w-5 text-gray-400" />
        )}
        <span>
          {count} {count === 1 ? "Like" : "Likes"}
        </span>
      </button>
    </div>
  );
};

export default CommentLikes;
