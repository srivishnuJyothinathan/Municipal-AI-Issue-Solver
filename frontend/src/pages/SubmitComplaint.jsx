import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../api';
import { ArrowLeft, MapPin } from 'lucide-react';

const SubmitComplaint = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('water');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await createComplaint(user.id, { title, category, description, location });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to submit complaint');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setLocation(`${position.coords.latitude}, ${position.coords.longitude}`),
        () => alert('Could not get location')
      );
    }
  };

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '600px' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--text-muted)' }}
      >
        <ArrowLeft size={18} style={{ marginRight: '0.5rem' }} /> Back
      </button>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Report an Issue</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="E.g., Broken pipe on Main St"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
            <select 
              className="input-field"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="water">Water</option>
              <option value="garbage">Garbage / Sanitation</option>
              <option value="road">Roads / Potholes</option>
              <option value="electricity">Electricity / Lighting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description</label>
            <textarea 
              className="input-field" 
              rows="4"
              placeholder="Provide details about the issue..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            ></textarea>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Note: Keywords like 'urgent' or 'emergency' will automatically elevate priority.
            </p>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Location</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Address or Landmark"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
              />
              <button type="button" className="btn" onClick={getUserLocation} style={{ border: '1px solid var(--border-color)' }}>
                <MapPin size={18} />
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '1rem', padding: '1rem' }}>
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
