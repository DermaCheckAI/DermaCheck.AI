import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  async function fetchHistory() {
    setLoading(true);
    setMsg('');

    // ✅ FRONTEND-ONLY FALLBACK (NO BACKEND)
    if (!token) {
      setHistory([
        {
          _id: '1',
          result: 'Benign',
          confidence: 0.92,
          createdAt: new Date(),
          notes: 'Sample demo history (offline mode)',
          imageUrl: ''
        }
      ]);
      setLoading(false);
      return;
    }

    /* 🔌 BACKEND MODE (UNCOMMENT WHEN READY)
    try {
      const res = await fetch('/api/history', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) throw new Error('Please login again');
      if (!res.ok) throw new Error('Failed to load history');

      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
    */

    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this record?')) return;

    // ✅ FRONTEND-ONLY DELETE
    if (!token) {
      setHistory((h) => h.filter((item) => item._id !== id));
      return;
    }

    /* 🔌 BACKEND DELETE (UNCOMMENT LATER)
    try {
      const res = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Could not delete');
      setHistory((h) => h.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message);
    }
    */
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar showRegisterButton={false} />

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-10 text-cyan-400">
            Scan History
          </h1>

          {msg && <p className="text-center text-red-400 mb-6">{msg}</p>}

          {loading ? (
            <p className="text-center text-gray-300">Loading history...</p>
          ) : history.length === 0 ? (
            <div className="text-center text-gray-300">
              <p>No scans available.</p>
              <Link to="/scan" className="text-cyan-400 mt-4 inline-block">
                Start a new scan →
              </Link>
            </div>
          ) : (
            <ul className="space-y-6">
              {history.map((item) => {
                const dateObj = new Date(item.createdAt);

                return (
                  <li
                    key={item._id}
                    className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/40 transition"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-cyan-300">
                          {item.result}
                        </h3>

                        <p className="text-sm text-gray-300 mt-1">
                          Confidence: {(item.confidence * 100).toFixed(0)}%
                        </p>
                      </div>

                      {/* 📅 Windows / System Date */}
                      <div className="text-xs text-gray-400 text-right">
                        <p>{dateObj.toLocaleDateString()}</p>
                        <p>{dateObj.toLocaleTimeString()}</p>
                      </div>
                    </div>

                    {item.notes && (
                      <p className="text-sm text-gray-300 mt-4">
                        {item.notes}
                      </p>
                    )}

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="mt-4 text-sm px-4 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 transition"
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
