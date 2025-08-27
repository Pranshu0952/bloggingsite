import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Register = () => {
  const { register: doRegister, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !email || !password) { setError('All fields are required'); return; }
    if (username.length < 3) { setError('Username must be at least 3 characters'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    const res = await doRegister({ username, email, password });
    if (res.ok) navigate('/', { replace: true });
    else setError(res.error);
  };

  return (
    <div className="card" style={{maxWidth:480, margin:'2rem auto'}}>
      <h2>Create account</h2>
      <form className="grid" style={{gap:'0.75rem'}} onSubmit={onSubmit}>
        <input className="input" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input className="input" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <div className="muted" style={{color:'#fca5a5'}}>{error}</div>}
        <button className="btn" disabled={loading} type="submit">{loading ? 'Creating...' : 'Register'}</button>
      </form>
      <div className="spacer" />
      <div className="muted">Already have an account? <Link to="/login">Login</Link></div>
    </div>
  );
};

export default Register;


