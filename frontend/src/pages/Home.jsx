import React, { useEffect, useState } from 'react';
import api from '../api/api.js';
import useAuth from '../hooks/useAuth.js';
import CreatePostForm from '../components/CreatePostForm.jsx';
import PostCard from '../components/PostCard/PostCard.jsx';

const Home = () => {
  const { user } = useAuth();
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
      {user && <CreatePostForm onCreated={() => fetchPosts()} />}
      {loading ? (
        <div className="muted">Loading feed...</div>
      ) : (
        posts.map((p) => (
          <PostCard key={p._id} post={p} onChange={fetchPosts} />
        ))
      )}
    </div>
  );
};

export default Home;


