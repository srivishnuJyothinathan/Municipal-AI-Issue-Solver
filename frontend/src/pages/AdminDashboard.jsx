import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllComplaints, updateComplaintStatus } from '../api';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement } from 'chart.js';
import { LogOut, Filter, Map as MapIcon, BarChart3 } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import L from 'leaflet';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement);
ChartJS.defaults.color = '#475569';
ChartJS.defaults.scale.grid.color = 'rgba(0,0,0,0.05)';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('analytics'); // analytics or map
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchComplaints();
  }, [navigate]);

  const fetchComplaints = async () => {
    try {
      const data = await getAllComplaints();
      const priorityOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      data.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      setComplaints(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateComplaintStatus(id, newStatus);
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- Data Processing for Charts ---
  const categories = ['water', 'garbage', 'road', 'electricity', 'other'];
  const categoryCounts = categories.map(cat => complaints.filter(c => c.category === cat).length);
  
  const barData = {
    labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
    datasets: [{
      label: 'Complaints',
      data: categoryCounts,
      backgroundColor: 'rgba(79, 70, 229, 0.7)',
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 1,
      borderRadius: 6
    }]
  };

  const priorityCounts = {
    'High': complaints.filter(c => c.priority === 'High').length,
    'Medium': complaints.filter(c => c.priority === 'Medium').length,
    'Low': complaints.filter(c => c.priority === 'Low').length,
  };

  const pieData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [{
      data: [priorityCounts['High'], priorityCounts['Medium'], priorityCounts['Low']],
      backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6'],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  // Line Chart: Complaints over time
  // Group by date
  const dateCounts = {};
  complaints.forEach(c => {
    const dateStr = new Date(c.created_at).toLocaleDateString();
    dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
  });
  const sortedDates = Object.keys(dateCounts).sort((a,b) => new Date(a) - new Date(b));

  const lineData = {
    labels: sortedDates,
    datasets: [{
      label: 'Complaints Reported',
      data: sortedDates.map(date => dateCounts[date]),
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
      borderWidth: 2,
      fill: true,
      tension: 0.4 // Smooth curves
    }]
  };

  const filteredComplaints = filter === 'All' ? complaints : complaints.filter(c => c.priority === filter);

  // Parse locations for heatmap
  const getCoordinates = (locStr, index) => {
    const coords = locStr.split(',').map(s => parseFloat(s.trim()));
    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
      return coords;
    }
    // Dummy coordinates around a center point (e.g., New York) if text location is provided
    const baseLat = 40.7128;
    const baseLng = -74.0060;
    // Spread them out slightly
    return [baseLat + (index * 0.01) * (index % 2 === 0 ? 1 : -1), baseLng + (index * 0.015) * (index % 3 === 0 ? 1 : -1)];
  };

  return (
    <div className="container animate-fade-in">
      <nav className="navbar" style={{ borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Admin Intelligence
        </h2>
        <div className="nav-links">
          <button className={`btn ${activeTab === 'analytics' ? 'btn-primary' : ''}`} style={{ border: activeTab === 'analytics' ? 'none' : '1px solid var(--border-color)'}} onClick={() => setActiveTab('analytics')}>
            <BarChart3 size={18} style={{ marginRight: '0.5rem' }} /> Analytics
          </button>
          <button className={`btn ${activeTab === 'map' ? 'btn-primary' : ''}`} style={{ border: activeTab === 'map' ? 'none' : '1px solid var(--border-color)'}} onClick={() => setActiveTab('map')}>
            <MapIcon size={18} style={{ marginRight: '0.5rem' }} /> Map View
          </button>
          <button className="btn" onClick={handleLogout} style={{ border: '1px solid var(--border-color)', marginLeft: '1rem' }}>
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {activeTab === 'analytics' ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Trend Over Time</h3>
              <div style={{ height: '250px' }}>
                <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Category Breakdown</h3>
              <div style={{ height: '250px' }}>
                <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              </div>
            </div>
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>Priority Severity</h3>
              <div style={{ height: '250px' }}>
                <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ marginBottom: '3rem', padding: '1rem' }}>
          <h3 style={{ marginBottom: '1rem', paddingLeft: '1rem', color: 'var(--text-muted)' }}>Issue Heatmap</h3>
          <div style={{ height: '500px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <MapContainer center={[40.7128, -74.0060]} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {complaints.map((c, idx) => {
                const pos = getCoordinates(c.location, idx);
                let color = c.priority === 'High' ? '#ef4444' : c.priority === 'Medium' ? '#f59e0b' : '#3b82f6';
                return (
                  <CircleMarker 
                    key={c.id} 
                    center={pos} 
                    pathOptions={{ color: color, fillColor: color, fillOpacity: 0.6 }} 
                    radius={c.priority === 'High' ? 12 : 8}
                  >
                    <Popup>
                      <strong>{c.title}</strong><br/>
                      Priority: {c.priority}<br/>
                      Status: {c.status}
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="glass-panel" style={{ padding: '2.5rem', marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h3>Command Center Queue</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select 
              className="input-field" 
              style={{ width: 'auto', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.9)' }}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title & Category</th>
                <th>Location</th>
                <th>Priority</th>
                <th>ML Conf.</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredComplaints.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{c.id}</td>
                  <td>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{c.title}</div>
                    <span className="badge" style={{ background: 'rgba(0,0,0,0.05)', fontSize: '0.7rem' }}>{c.category}</span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{c.location}</td>
                  <td>
                    <span className={`badge priority-${c.priority.toLowerCase()}`}>{c.priority}</span>
                  </td>
                  <td style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {(c.ml_confidence * 100).toFixed(1)}%
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: c.status === 'Resolved' ? 'var(--secondary)' : c.status === 'In Progress' ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {c.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="input-field" 
                      style={{ padding: '0.4rem 0.75rem', width: 'auto', fontSize: '0.875rem' }}
                      value={c.status}
                      onChange={(e) => handleStatusUpdate(c.id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No complaints match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
