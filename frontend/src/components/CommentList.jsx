import React from 'react';
import { timeAgo } from '../utils/helpers.js';

const CommentList = ({ comments = [] }) => {
  if (!comments.length) return <div className="muted">No comments yet</div>;
  return (
    <div className="grid" style={{gap:'0.75rem'}}>
      {comments.map((c) => (
        <div key={c._id} className="card" style={{padding:'0.75rem'}}>
          <div className="flex" style={{justifyContent:'space-between'}}>
            <div className="flex">
              <img className="avatar" src={c.user?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${c.user?.username}`} alt="avatar" />
              <div>
                <div style={{fontWeight:600}}>{c.user?.username || 'User'}</div>
                <div className="muted" style={{fontSize:'0.8rem'}}>{timeAgo(c.createdAt)}</div>
              </div>
            </div>
          </div>
          <div style={{marginTop:'0.5rem'}}>{c.text}</div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;


