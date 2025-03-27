import { useState, useEffect } from 'react';
import { getCommentsByPost } from '../api';
import { useParams } from 'react-router-dom';

const Comments = () => {
  const [comments, setComments] = useState([]);
  const { postId } = useParams();

  useEffect(() => {
    getCommentsByPost(postId).then((comments) => {
      setComments(comments);
    });
  }, [postId]);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return (
    <div>
      <h1>Comments</h1>
      <ul>
        {comments.map((comment) => {
          return (
            <li>
              <p>{comment.content}</p>
              <p>
                By <strong>{comment.username}</strong> posted on{' '}
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
