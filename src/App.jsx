import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import MyNotes from './pages/MyNotes';
import AllNotes from './pages/AllNotes';
import UsersList from './pages/UsersList';
import InterestsView from './pages/InterestsView';
import UserPostsView from './pages/UserPostsView';

function App() {
  const savedUser = localStorage.getItem('user');
  const user = savedUser ? JSON.parse(savedUser) : null;
  const isAuthed = Boolean(savedUser);
  const isAdmin = user?.role === 'admin';

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    window.location.href = userData?.role === 'admin' ? '/all-notes' : '/notes';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="flex-1">
          <Routes>
            <Route
              path="/login"
              element={isAuthed ? <Navigate to={isAdmin ? '/all-notes' : '/notes'} replace /> : <Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/signup"
              element={isAuthed ? <Navigate to={isAdmin ? '/all-notes' : '/notes'} replace /> : <Signup onLoginSuccess={handleLoginSuccess} />}
            />

            <Route
              path="/"
              element={
                isAuthed ? (
                  <Navigate to={isAdmin ? '/all-notes' : '/notes'} replace />
                ) : (
                  <Navigate to="/login" replace />
                )
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

            <Route path="*" element={<Navigate to={isAuthed ? (isAdmin ? '/all-notes' : '/notes') : '/login'} replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;


