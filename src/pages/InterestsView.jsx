import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InterestsView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const fetchInterestsAggregation = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:3000/api/users/by-interest', {
        withCredentials: true,
      });
      setData(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load aggregation data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterestsAggregation();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded uppercase">
            MongoDB Aggregation (Scenario 1)
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Users Grouped by Interest</h1>
        <p className="text-slate-500 text-sm">
          Specific view displaying all users grouped by common interest tags using a single aggregation pipeline (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">$unwind</code> + <code className="bg-slate-100 px-1 py-0.5 rounded text-xs font-mono">$group</code>).
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2.5 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-slate-500">Calculating aggregation results...</div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
          No interests data available yet. Users can add interests on signup or profile edit.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-indigo-200 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-slate-800 capitalize flex items-center gap-1.5">
                  🏷️ {item._id}
                </span>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.count} {item.count === 1 ? 'user' : 'users'}
                </span>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Interested Users:</p>
                <div className="divide-y divide-slate-100">
                  {item.users.map((u, i) => (
                    <div key={i} className="py-1 text-sm text-slate-700 flex items-center gap-2">
                      <span className="text-slate-400 text-xs">•</span>
                      <span>{u.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterestsView;

