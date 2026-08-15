import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    interestsInput: 'reading, coding',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Turn comma-separated interests string into a clean array
    const interests = formData.interestsInput
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item.length > 0);

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      interests,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/signup', payload, {
        withCredentials: true,
      });

      if (response.data && response.data.user) {
        if (onLoginSuccess) {
          onLoginSuccess(response.data.user);
        }
        navigate('/notes');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Signup failed. Please try again with valid information.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-1 text-center">Create Account</h2>
        <p className="text-slate-500 text-sm text-center mb-6">Join to start taking notes and sharing posts</p>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Interests <span className="text-slate-400 font-normal">(comma separated)</span>
            </label>
            <input
              type="text"
              name="interestsInput"
              value={formData.interestsInput}
              onChange={handleChange}
              placeholder="e.g. chess, reading, coding"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;


