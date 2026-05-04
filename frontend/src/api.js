import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8002',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginUser = async (username, password) => {
  const response = await api.post('/login/', { username, password });
  return response.data;
};

export const registerUser = async (username, password, role = 'user') => {
  const response = await api.post('/users/', { username, password, role });
  return response.data;
};

export const createComplaint = async (userId, complaintData) => {
  const response = await api.post(`/complaints/?user_id=${userId}`, complaintData);
  return response.data;
};

export const getUserComplaints = async (userId) => {
  const response = await api.get(`/complaints/user/${userId}`);
  return response.data;
};

export const getAllComplaints = async () => {
  const response = await api.get('/complaints/');
  return response.data;
};

export const updateComplaintStatus = async (complaintId, status) => {
  const response = await api.put(`/complaints/${complaintId}/status`, { status });
  return response.data;
};
