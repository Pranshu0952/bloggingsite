import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/api.js';
import useAuth from '../hooks/useAuth.js';
import PostCard from '../components/PostCard/PostCard.jsx';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(user);
  const [posts, setPosts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: user?.username || '', avatar: user?.avatar || '', bio: user?.bio || '' });

  const fetchMe = async () => {
    const res = await api.get('/users/me');
    setProfile(res.data);
    setUser(res.data);
  };

  const fetchPosts = async () => {
    if (!user?._id) return;
    const res = await api.get(`/posts/user/${user._id}`);
    setPosts(res.data);
  };

  useEffect(() => { fetchMe(); fetchPosts(); }, []);

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/me', form);
      setProfile(res.data);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } finally {
      setSaving(false);
    }
  };

  const followersCount = profile?.followers?.length || 0;
  const followingCount = profile?.following?.length || 0;

  return (
    <div className="grid" style={{gap:'1rem'}}>
      <div className="card" style={{display:'grid', gap:'0.75rem'}}>
        <h2>My Profile</h2>
        <form className="grid" style={{gap:'0.5rem'}} onSubmit={onSave}>
          <label>Username</label>
          <input className="input" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} />
          <label>Avatar URL</label>
          <input className="input" value={form.avatar} onChange={(e)=>setForm({...form, avatar:e.target.value})} />
          <label>Bio</label>
          <textarea className="textarea" rows="3" value={form.bio} onChange={(e)=>setForm({...form, bio:e.target.value})} />
          <div className="flex" style={{justifyContent:'space-between'}}>
            <div className="muted">Followers: {followersCount} • Following: {followingCount}</div>
            <button className="btn" disabled={saving} type="submit">{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>

      <div className="grid" style={{gap:'1rem'}}>
        {posts.map((p) => (
          <PostCard key={p._id} post={p} onChange={fetchPosts} />
        ))}
      </div>
    </div>
  );
};

export default Profile;


