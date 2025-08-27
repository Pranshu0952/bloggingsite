import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Email and password are required'); return; }
    const res = await login(email, password);
    if (res.ok) navigate(from, { replace: true });
    else setError(res.error);
  };

  return (
    <div className="card" style={{maxWidth:480, margin:'2rem auto'}}>
      <h2>Login</h2>
      <form className="grid" style={{gap:'0.75rem'}} onSubmit={onSubmit}>
        <input className="input" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        {error && <div className="muted" style={{color:'#fca5a5'}}>{error}</div>}
        <button className="btn" disabled={loading} type="submit">{loading ? 'Signing in...' : 'Login'}</button>
      </form>
      <div className="spacer" />
      <div className="muted">Don't have an account? <Link to="/register">Register</Link></div>
    </div>
  );
};

export default Login;


