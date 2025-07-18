import { useState, useEffect } from "react";
import { likePost, unlikePost, countPostLikes } from "../../api/like";
// import { createNotification } from "../../api/notification";
import { Heart, HeartOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import socket from "../../../socket";

const PostLikes = ({ postId, post }) => {
  const [count, setCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const { count, likedByUser } = await countPostLikes(postId);
        setCount(count);
        setIsLiked(likedByUser);
      } catch (err) {
        console.error("Failed to fetch post count and like status", err);
      }
    };
    fetchCount();
  }, [postId]);

  const handleChange = async () => {
    try {
      if (isLiked) {
        await unlikePost(postId);
        setIsLiked(false);
      } else {
        await likePost(postId);
        setIsLiked(true);

        if (post.user_id !== currentUser.id) {
          const notification = {
            recipientId: post.user_id,
            senderId: currentUser.id,
            type: "like_post",
            referenceId: postId,
            message: `${currentUser.username} liked your post`,
          };
          socket.emit("send notification", notification);
          // await createNotification(post.user_id, notification);
        }
      }
      const { count: updatedCount } = await countPostLikes(postId);
      setCount(updatedCount);
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  return (
    <button
      onClick={handleChange}
      aria-label={isLiked ? "Unlike post" : "Like post"}
      className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-red-500"
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
  );
};

export default PostLikes;
