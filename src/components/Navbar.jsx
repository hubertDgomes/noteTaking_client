import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <Link to="/" className="text-xl font-bold tracking-wide text-indigo-400 hover:text-indigo-300">
          📝 SecureNotes
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          {isAuthenticated ? (
            <>
              <Link
                to="/notes"
                className={'px-3 py-1.5 rounded-md text-sm font-medium transition ' + (isActive('/notes') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800')}
              >
                My Notes
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/all-notes"
                    className={'px-3 py-1.5 rounded-md text-sm font-medium transition ' + (isActive('/all-notes') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800')}
                  >
                    All Notes (Admin)
                  </Link>
                  <Link
                    to="/users"
                    className={'px-3 py-1.5 rounded-md text-sm font-medium transition ' + (isActive('/users') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800')}
                  >
                    Manage Users
                  </Link>
                </>
              )}

              <Link
                to="/interests"
                className={'px-3 py-1.5 rounded-md text-sm font-medium transition ' + (isActive('/interests') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800')}
              >
                Interests Grouping
              </Link>

              <Link
                to="/posts"
                className={'px-3 py-1.5 rounded-md text-sm font-medium transition ' + (isActive('/posts') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800')}
              >
                User Posts ($lookup)
              </Link>

              {/* User Info & Logout */}
              <div className="flex items-center gap-3 ml-2 pl-2 border-l border-slate-700">
                <div className="text-right hidden sm:block">
                  <div className="text-xs text-slate-200 font-semibold">{user?.name}</div>
                  <span
                    className={'inline-block text-[10px] font-bold uppercase px-1.5 py-0.2 rounded ' + (isAdmin ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300')}
                  >
                    {user?.role || 'user'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className={'px-3 py-1.5 rounded-md text-sm font-medium ' + (isActive('/login') ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800')}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-3.5 py-1.5 rounded-md transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
