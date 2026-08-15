import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/apiConfig';

const AllNotes = () => {
  const [notes, setNotes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAllNotes = async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get(`/api/notes/all?page=${page}&limit=6`);
      setNotes(response.data.notes || []);
      setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch all notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotes(1);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded uppercase">
            Admin View
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">All System Notes</h1>
        <p className="text-slate-500 text-sm">
          As an Admin, you have permission to view all notes created by all users across the platform.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading notes from all users...</div>
      ) : notes.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          No notes found in the system.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {notes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      Author: {note.owner?.name || 'Unknown'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-800 mb-1 line-clamp-1">{note.title}</h3>
                  <p className="text-slate-600 text-sm whitespace-pre-line mb-4 line-clamp-4">{note.content}</p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-400 flex items-center justify-between">
                  <span>{note.owner?.email || 'N/A'}</span>
                  <span className="capitalize font-medium text-slate-500">{note.owner?.role || 'user'}</span>
                </div>
              </div>
            ))}
          </div>


          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total notes across all users)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => fetchAllNotes(pagination.page - 1)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => fetchAllNotes(pagination.page + 1)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllNotes;

