import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteForm, setNoteForm] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  
  const fetchNotes = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/notes?page=${page}&limit=6`, {
        withCredentials: true,
      });
      setNotes(response.data.notes || []);
      setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchNotes(1);
  }, []);

  const openAddModal = () => {
    setEditingNote(null);
    setNoteForm({ title: '', content: '' });
    setShowModal(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setNoteForm({ title: note.title, content: note.content });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setNoteForm({ title: '', content: '' });
  };


  const handleSaveNote = async (e) => {
    e.preventDefault();
    if (!noteForm.title || !noteForm.content) {
      setError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      if (editingNote) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/notes/${editingNote._id}`, noteForm, {
          withCredentials: true,
        });
        setMessage('Note updated successfully!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/createNote`, noteForm, {
          withCredentials: true,
        });
        setMessage('Note created successfully!');
      }
      closeModal();
      fetchNotes(pagination.page);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/notes/${noteId}`, {
        withCredentials: true,
      });
      setMessage('Note deleted successfully!');
      fetchNotes(pagination.page);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete note');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Notes</h1>
          <p className="text-slate-500 text-sm">Create, view, edit, and organize your private notes</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
        >
          <span>➕</span> Create New Note
        </button>
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

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading your notes...</div>
      ) : notes.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-slate-600 font-medium mb-2">You don't have any notes yet</p>
          <p className="text-slate-400 text-sm mb-4">Click below to write your first secure note.</p>
          <button
            onClick={openAddModal}
            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium px-4 py-2 rounded-md text-sm transition cursor-pointer"
          >
            Create Note
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 line-clamp-1">{note.title}</h3>
                  <p className="text-slate-600 text-sm whitespace-pre-line mb-4 line-clamp-4">{note.content}</p>
                </div>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(note)}
                      className="text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 px-2 py-1 rounded cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-rose-600 hover:text-rose-800 font-medium text-xs bg-rose-50 px-2 py-1 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total notes)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchNotes(pagination.page - 1)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchNotes(pagination.page + 1)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {editingNote ? 'Edit Note' : 'Create New Note'}
            </h2>
            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  placeholder="Note title..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                <textarea
                  rows="5"
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  placeholder="Write your note content here..."
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? 'Saving...' : editingNote ? 'Save Changes' : 'Create Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNotes;

