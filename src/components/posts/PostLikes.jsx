import { useState, useEffect } from "react";
import { likePost, unlikePost, countPostLikes } from "../../api/like";
import { createNotification } from "../../api/notification";
import { Heart, HeartOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

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
        const notification = {
          type: "like_post",
          referenceId: postId,
          message: `${currentUser.username} liked your post`,
          recipientId: post.user_id,
          senderId: currentUser.id,
        };
        await createNotification(post.user_id, notification);
      }
      const { count: updatedCount } = await countPostLikes(postId);
      setCount(updatedCount);
    } catch (err) {
      console.error("Failed to like post", err);
    }
  };

  return (
    <div className="p-2">
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

export default PostLikes;
