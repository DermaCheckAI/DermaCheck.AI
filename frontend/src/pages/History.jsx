import { UNSAFE_getPatchRoutesOnNavigationFunction } from "react-router-dom";

UNSAFE_getPatchRoutesOnNavigationFunction
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token'); // or read from context

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, []);

  async function fetchHistory() {
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch('/api/history', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401) throw new Error('Unauthorized — please login again');
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to load history');
      }
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this record?')) return;
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
          <h1 className="text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
            Your Scan History
          </h1>

          {msg && <p className="text-center text-red-400 mb-4">{msg}</p>}

          {loading ? (
            <p className="text-center text-gray-300">Loading...</p>
          ) : history.length === 0 ? (
            <div className="text-center text-gray-300">
              <p>No scans yet.</p>
              <Link to="/scan" className="text-cyan-400 mt-4 inline-block">Start a new scan</Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {history.map((item) => (
                <li key={item._id} className="bg-white bg-opacity-5 backdrop-blur p-4 rounded-xl border border-cyan-400 border-opacity-20 flex gap-4 items-center">
                  <div className="w-28 h-20 flex-shrink-0 rounded-lg overflow-hidden border border-gray-700">
                    {/* thumbnail image (if you store imageUrl) */}
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt="scan" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{item.result || 'Unknown'}</h3>
                        <p className="text-sm text-gray-300">Confidence: {(item.confidence ?? 0).toFixed(2)}</p>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        {new Date(item.createdAt).toLocaleString()}
                      </div>
                    </div>

                    {item.notes && <p className="text-sm mt-2 text-gray-300">{item.notes}</p>}

                    <div className="mt-3 flex gap-2">
                      <a
                        href={item.imageUrl || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm px-3 py-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30"
                      >
                        Open Image
                      </a>

                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-sm px-3 py-1 rounded-md bg-red-600/20 hover:bg-red-600/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
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
