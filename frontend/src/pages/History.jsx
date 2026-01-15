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

    // ✅ FRONTEND-ONLY FALLBACK
    if (!token) {
      setHistory([
        {
          _id: '1',
          result: 'Benign',
          confidence: 0.92,
          createdAt: new Date(),
          notes: 'Sample demo history',
          imageUrl: ''
        }
      ]);
      setLoading(false);
      return;
    }

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
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this record?')) return;

    // frontend-only delete
    if (!token) {
      setHistory((h) => h.filter((item) => item._id !== id));
      return;
    }

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
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Navbar showRegisterButton={false} />

      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-6 text-cyan-400">
            Your Scan History
          </h1>

          {msg && <p className="text-center text-red-400 mb-4">{msg}</p>}

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : history.length === 0 ? (
            <div className="text-center">
              <p>No scans yet.</p>
              <Link to="/scan" className="text-cyan-400 mt-4 inline-block">
                Start a new scan
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {history.map((item) => (
                <li key={item._id} className="bg-white/5 p-4 rounded-xl border border-cyan-400/20">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold">{item.result}</h3>
                      <p className="text-sm">Confidence: {item.confidence}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>

                  {item.notes && <p className="text-sm mt-2">{item.notes}</p>}

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="mt-3 text-sm px-3 py-1 bg-red-600/20 rounded"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
