import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSinglePost } from '../api';
import Comments from './Comments';

const SinglePost = () => {
  const [singlePost, setSinglePost] = useState({});
  const { postId } = useParams();

  useEffect(() => {
    getSinglePost(postId).then((post) => {
      setSinglePost(post);
    });
  }, [postId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown Time';
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return (
    <div>
      <div className="mx-auto mt-20 max-w-xl text-center">
        <div className="w-full space-y-3 border bg-red-200 p-4 text-xl font-semibold text-stone-700">
          <h3>{singlePost.content}</h3>
          <p>
            By <strong>{singlePost.username}</strong> posted on:{' '}
            {formatTimestamp(singlePost.created_at)}
          </p>
        </div>
        <Comments />
      </div>
    </div>
  );
};

export default SinglePost;
