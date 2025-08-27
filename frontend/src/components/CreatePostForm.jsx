import React, { useState } from 'react';
import api from '../api/api.js';

const CreatePostForm = ({ onCreated }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!content.trim()) { setError('Content is required'); return; }
    setLoading(true);
    try {
      const form = new FormData();
      form.append('content', content);
      if (file) form.append('image', file);
      const res = await api.post('/posts', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setContent('');
      setFile(null);
      onCreated && onCreated(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h3>Create a post</h3>
      <textarea className="textarea" rows="3" placeholder="What's on your mind?" value={content} onChange={(e)=>setContent(e.target.value)} />
      <div className="flex" style={{justifyContent:'space-between'}}>
        <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0])} />
        <button className="btn" disabled={loading} type="submit">{loading ? 'Posting...' : 'Post'}</button>
      </div>
      {error && <div className="muted" style={{color:'#fca5a5'}}>{error}</div>}
    </form>
  );
};

export default CreatePostForm;


