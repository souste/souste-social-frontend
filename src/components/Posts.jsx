import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPosts } from '../api';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts().then((posts) => {
      setPosts(posts);
    });
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown Time';
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
  };

  return (
    <div>
      <ul className="text-center text-xl font-semibold text-red-400">
        {posts.map((post) => {
          return (
            <Link key={post.id} to={`/posts/${post.id}`}>
              <li>
                <h3>{post.content}</h3>
                <p>
                  By <strong>{post.username}</strong> posted on:
                  {formatTimestamp(post.created_at)}
                </p>
              </li>
            </Link>
          );
        })}
      </ul>
    </div>
  );
};

export default Posts;
