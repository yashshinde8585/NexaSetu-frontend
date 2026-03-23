import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', formData);
      localStorage.setItem('token', data.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" placeholder="Name" required 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
        />
        <input 
          type="email" placeholder="Email" required 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
        />
        <input 
          type="password" placeholder="Password" required 
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
        />
        <button type="submit">Create Account</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
