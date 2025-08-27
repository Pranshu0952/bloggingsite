import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api.js';
import useAuth from '../hooks/useAuth.js';
import CommentList from '../components/CommentList.jsx';
import { timeAgo } from '../utils/helpers.js';

const PostDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } finally {
      setLoading(false);
    }
  };

  const onComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const res = await api.post(`/posts/${id}/comment`, { text });
    setPost(res.data);
    setText('');
  };

  const toggleLike = async () => {
    if (!user) return;
    const res = await api.put(`/posts/${id}/like`);
    setPost(res.data);
  };

  useEffect(() => { fetchPost(); }, [id]);

  if (loading) return <div className="muted">Loading...</div>;
  if (!post) return <div className="muted">Post not found</div>;

  const liked = user && post.likes?.some((l) => l === user._id || l?._id === user._id);

  return (
    <div className="grid" style={{gap:'1rem'}}>
      <div className="card" style={{display:'grid', gap:'0.75rem'}}>
        <div className="flex" style={{justifyContent:'space-between'}}>
          <div className="flex">
            <img className="avatar" src={post.user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${post.user?.username}`} alt="avatar" />
            <div>
              <div style={{fontWeight:600}}>{post.user?.username}</div>
              <div className="muted" style={{fontSize:'0.9rem'}}>{timeAgo(post.createdAt)}</div>
            </div>
          </div>
        </div>
        <div style={{whiteSpace:'pre-wrap'}}>{post.content}</div>
        {post.image && <img style={{width:'100%', borderRadius:8}} src={post.image} alt="post" />}
        <div className="flex" style={{justifyContent:'space-between'}}>
          <button className={`btn ${liked ? 'secondary' : ''}`} onClick={toggleLike} disabled={!user}>
            {liked ? 'Unlike' : 'Like'} • {post.likes?.length || 0}
          </button>
          <div className="muted">Comments • {post.comments?.length || 0}</div>
        </div>
      </div>

      <div className="card" style={{display:'grid', gap:'0.5rem'}}>
        <h3>Comments</h3>
        <CommentList comments={post.comments} />
        <form className="flex" onSubmit={onComment}>
          <input className="input" placeholder="Write a comment..." value={text} onChange={(e)=>setText(e.target.value)} />
          <button className="btn" type="submit" disabled={!user || !text.trim()}>Send</button>
        </form>
      </div>
    </div>
  );
};

export default PostDetails;


