import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api.js';
import useAuth from '../../hooks/useAuth.js';
import { timeAgo } from '../../utils/helpers.js';
import './PostCard.css';

const PostCard = ({ post, onChange }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const liked = user && post.likes?.some((id) => id === user._id || id?._id === user._id);

  const toggleLike = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.put(`/posts/${post._id}/like`);
      onChange && onChange(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card post-card">
      <div className="post-header">
        <div className="flex">
          <img className="avatar" src={post.user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.user?.username}`} alt="avatar" />
          <div>
            <div className="username">{post.user?.username}</div>
            <div className="muted">{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        <Link className="muted" to={`/posts/${post._id}`}>View</Link>
      </div>
      <div className="post-content">{post.content}</div>
      {post.image && (
        <img className="post-image" src={post.image} alt="post" />
      )}
      <div className="post-actions">
        <button disabled={!user || loading} className={`btn ${liked ? 'secondary' : ''}`} onClick={toggleLike}>
          {liked ? 'Unlike' : 'Like'} • {post.likes?.length || 0}
        </button>
        <div className="muted">Comments • {post.comments?.length || 0}</div>
      </div>
    </div>
  );
};

export default PostCard;


