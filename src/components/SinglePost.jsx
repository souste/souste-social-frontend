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
      <h3>{singlePost.content}</h3>
      <p>
        By <strong>{singlePost.username}</strong> posted on:{' '}
        {formatTimestamp(singlePost.created_at)}
      </p>
      <Comments />
    </div>
  );
};

export default SinglePost;
