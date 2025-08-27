import React, { useEffect, useState } from 'react';
import api from '../api/api.js';
import PostCard from '../components/PostCard/PostCard.jsx';

const AllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="grid" style={{gap:'1rem'}}>
      {loading ? (
        <div className="muted">Loading posts...</div>
      ) : (
        posts.map((p) => (
          <PostCard key={p._id} post={p} onChange={fetchPosts} />
        ))
      )}
    </div>
  );
};

export default AllPosts;


