import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyNotes from './pages/MyNotes';
import AllNotes from './pages/AllNotes';
import UsersList from './pages/UsersList';
import InterestsView from './pages/InterestsView';
import UserPostsView from './pages/UserPostsView';

function App() {
  // Simple local state for logged in user (with localStorage fallback)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check if session cookie is active on page refresh
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('/api/profile', {
          withCredentials: true,
        });
        if (response.data && response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
      } catch (err) {
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Handler passed to Login and Signup
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Handler passed to Navbar for logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        Loading...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={user ? <Navigate to="/notes" replace /> : <Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/signup"
              element={user ? <Navigate to="/notes" replace /> : <Signup onLoginSuccess={handleLoginSuccess} />}
            />

            {/* Protected Routes (User must be logged in) */}
            <Route
              path="/"
              element={
                <ProtectedRoute user={user}>
                  <Navigate to="/notes" replace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notes"
              element={
                <ProtectedRoute user={user}>
                  <MyNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/interests"
              element={
                <ProtectedRoute user={user}>
                  <InterestsView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/posts"
              element={
                <ProtectedRoute user={user}>
                  <UserPostsView />
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Routes */}
            <Route
              path="/all-notes"
              element={
                <AdminRoute user={user}>
                  <AllNotes />
                </AdminRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AdminRoute user={user}>
                  <UsersList />
                </AdminRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/notes" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;


