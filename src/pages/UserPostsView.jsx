import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const UserPostsView = () => {
  const [searchParams] = useSearchParams();
  const queryUserId = searchParams.get('userId') || '';

  // Users dropdown selector state
  const [userList, setUserList] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(queryUserId);
  const [userData, setUserData] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // New post creation state
  const [postForm, setPostForm] = useState({ title: '', content: '' });
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 1. Fetch users list for dropdown selector
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/users?limit=50', {
          withCredentials: true,
        });
        const list = res.data.users || [];
        setUserList(list);
        if (!selectedUserId && list.length > 0) {
          setSelectedUserId(list[0]._id);
        }
      } catch (err) {
        console.error('Failed to load users:', err);
      }
    };
    fetchUsers();
  }, []);

  // 2. Fetch user posts using MongoDB $lookup aggregation
  const fetchUserPosts = async (userId) => {
    if (!userId) return;
    setLoadingPosts(true);
    setError('');
    try {
      const response = await axios.get(`/api/users/${userId}/posts`, {
        withCredentials: true,
      });
      setUserData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user posts via $lookup');
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    if (selectedUserId) {
      fetchUserPosts(selectedUserId);
    }
  }, [selectedUserId]);

  // 3. Create a new public post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postForm.title.trim() || !postForm.content.trim()) return;

    setCreating(true);
    setError('');
    try {
      await axios.post('/api/posts', postForm, {
        withCredentials: true,
      });
      setMessage('Post created successfully!');
      setPostForm({ title: '', content: '' });
      if (selectedUserId) {
        fetchUserPosts(selectedUserId);
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded uppercase">
            MongoDB Aggregation (Scenario 2)
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">User Posts ($lookup)</h1>
        <p className="text-slate-500 text-sm">
          Retrieve all posts belonging to a particular user using a single aggregation pipeline with a <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">$lookup</code> stage.
        </p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-lg text-sm mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Create Post Form */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 self-start">
          <h2 className="text-lg font-bold text-slate-800 mb-2">Create New Public Post</h2>
          <p className="text-slate-500 text-xs mb-4">
            Posts are stored in the Posts collection and linked to your user profile.
          </p>

          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Post Title</label>
              <input
                type="text"
                value={postForm.title}
                onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                placeholder="Title..."
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Content</label>
              <textarea
                rows="4"
                value={postForm.content}
                onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                placeholder="Write your public post..."
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition text-sm disabled:opacity-50 cursor-pointer"
            >
              {creating ? 'Publishing...' : 'Publish Post'}
            </button>
          </form>
        </div>

        {/* Right Column: Aggregation Lookup Results */}
        <div className="lg:col-span-2 space-y-4">
          {/* User selector */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <label className="text-sm font-medium text-slate-700">Select User to View Posts:</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {userList.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>

          {/* Posts Result */}
          {loadingPosts ? (
            <div className="text-center py-12 text-slate-500">Executing $lookup pipeline...</div>
          ) : userData ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <div className="border-b border-slate-100 pb-4 mb-4">
                <h3 className="text-lg font-bold text-slate-800">{userData.name}</h3>
                <p className="text-xs text-slate-500">{userData.email}</p>
                <span className="inline-block mt-2 text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                  {(userData.posts?.length || 0) + ' Total Posts Found ($lookup)'}
                </span>
              </div>

              {userData.posts && userData.posts.length > 0 ? (
                <div className="space-y-4">
                  {userData.posts.map((post) => (
                    <div
                      key={post._id}
                      className="p-4 rounded-lg bg-slate-50 border border-slate-200/80 hover:bg-slate-50/80 transition"
                    >
                      <h4 className="text-base font-semibold text-slate-800 mb-1">{post.title}</h4>
                      <p className="text-sm text-slate-600 whitespace-pre-line">{post.content}</p>
                      <span className="block mt-2 text-[11px] text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-6">
                  No posts found for this user in the Posts collection.
                </p>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserPostsView;

