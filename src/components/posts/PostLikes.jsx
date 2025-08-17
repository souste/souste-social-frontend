import { useState, useEffect } from "react";
import { likePost, unlikePost, countPostLikes } from "../../api/like";
// import { createNotification } from "../../api/notification";
import { Heart } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import socket from "../../../socket";

const PostLikes = ({ postId, post, initialCount, initialLiked }) => {
  const [count, setCount] = useState(initialCount ?? 0);
  const [isLiked, setIsLiked] = useState(initialLiked ?? false);
  const [inFlight, setInFlight] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (initialCount == null || initialLiked == null) {
      (async () => {
        try {
          const { count, likedByUser } = await countPostLikes(postId);
          setCount(count);
          setIsLiked(likedByUser);
        } catch (e) {
          console.error("Failed to fetch post like info", e);
        }
      })();
    }
  }, [postId, initialCount, initialLiked]);

  const handleChange = async () => {
    if (inFlight) return;
    setInFlight(true);

    const wasLiked = isLiked;
    const delta = wasLiked ? -1 : 1;

    setIsLiked(!wasLiked);
    setCount((c) => Math.max(0, c + delta));

    try {
      if (wasLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);

        if (
          post?.user_id &&
          currentUser?.id &&
          post.user_id !== currentUser.id
        ) {
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
    } catch (err) {
      console.error("Failed to toggle like", err);
      setIsLiked(wasLiked);
      setCount((c) => Math.max(0, c - delta));
    } finally {
      setInFlight(false);
    }
  };

  return (
    <button
      onClick={handleChange}
      aria-label={isLiked ? "Unlike post" : "Like post"}
      className="flex items-center gap-2 text-sm text-gray-600 transition hover:text-red-500"
    >
      <Heart
        className={`h-5 w-5 transition-transform ${isLiked ? "scale-110 text-rose-600" : "text-stone-600"}`}
        fill={isLiked ? "currentColor" : "none"}
        strokeWidth={2}
      />
      <span>
        {count} {count === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
};

export default PostLikes;
