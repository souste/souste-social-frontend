import { useState, useEffect } from "react";
import { likePost, countPostLikes } from "../../api/like";
import { Heart } from "lucide-react";

const PostLikes = ({ postId }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await countPostLikes(postId);
        setCount(count);
      } catch (err) {
        console.error("Failed to fetch post count", err);
      }
    };
    fetchCount();
  }, [postId]);

  const handleChange = async () => {
    try {
      await likePost(postId);
      const updatedCount = await countPostLikes(postId);
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
          <Heart className="h-5 w-5 text-red-500" />
          Like
        </button>
        <div>Count: {count}</div>
      </div>
    </div>
  );
};

export default PostLikes;
