import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserComplaints } from '../api';
import { PlusCircle, LogOut } from 'lucide-react';

const UserDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    const fetchComplaints = async () => {
      try {
        const data = await getUserComplaints(parsedUser.id);
        setComplaints(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchComplaints();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container animate-fade-in">
      <nav className="navbar" style={{ borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <h2>My Complaints</h2>
        <div className="nav-links">
          <span style={{ fontWeight: 500 }}>Hello, {user?.username}</span>
          <button className="btn btn-primary" onClick={() => navigate('/report')}>
            <PlusCircle size={18} style={{ marginRight: '0.5rem' }} /> Report Issue
          </button>
          <button className="btn" onClick={handleLogout} style={{ border: '1px solid var(--border-color)' }}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {complaints.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>You haven't reported any issues yet.</p>
        </div>
      ) : (
        <div className="dashboard-grid">
          {complaints.map(complaint => (
            <div key={complaint.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: '#e2e8f0', color: '#475569' }}>
                  {complaint.category}
                </span>
                <span className={`badge priority-${complaint.priority.toLowerCase()}`}>
                  {complaint.priority} Priority
                </span>
              </div>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{complaint.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {complaint.description}
              </p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <p><strong>Status:</strong> <span style={{ fontWeight: 600, color: complaint.status === 'Resolved' ? 'var(--secondary)' : 'var(--text-main)' }}>{complaint.status}</span></p>
                <p><strong>Location:</strong> {complaint.location}</p>
                <p><strong>Reported:</strong> {new Date(complaint.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
