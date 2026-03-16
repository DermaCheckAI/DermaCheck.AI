import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate instead of window.location
import { useState, useEffect } from 'react';
import { login } from '../firebase'; // Import your Firebase login helper
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      // 1. USE FIREBASE LOGIN INSTEAD OF FETCH
      await login(form.email, form.password);
      
      setMsg('Login successful! Redirecting...');
      
      // 2. USE NAVIGATE FOR SMOOTHER TRANSITION
      setTimeout(() => navigate('/analysis'), 2000);
    } catch (err) {
      // Error handling is actually inside your firebase.js toast, 
      // but we set it here for the UI text too
      setMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep all your existing scroll logic and useEffect) ...
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) featuresSection.scrollIntoView({ behavior: 'smooth' });
  };

  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const handleScroll = () => setShowScrollButton(window.scrollY > 300);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background elements stay the same */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-pulse"></div>
        {/* ... */}
      </div>

      <Navbar showRegisterButton={true} />

      <main className="relative z-5 flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-20 gap-20 px-8">
          {/* Left Side Branding */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-8 leading-tight">Welcome to DermaCheck.AI</h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">Your AI-powered dermatology assistant for fast, accurate skin diseases classification!</p>
            <div className="flex gap-4 flex-col md:flex-row">
              <Link to="/register" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all text-lg text-center">Get Started</Link>
              <button onClick={scrollToFeatures} className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold px-8 py-4 rounded-xl transition-all text-lg">Learn More</button>
            </div>
          </div>

          {/* Right Side: Firebase Login Form */}
          <div className="flex-1 max-w-md w-full bg-white bg-opacity-5 backdrop-blur-lg border border-cyan-400 border-opacity-30 rounded-2xl shadow-2xl p-10">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center">Login</h2>
            <form onSubmit={submit} className="flex flex-col gap-6">
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={form.email}
                onChange={handle}
                className="w-full border border-cyan-400 border-opacity-30 bg-white bg-opacity-5 rounded-lg px-5 py-3 text-white focus:border-opacity-100 focus:outline-none transition-all" 
                required 
              />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={form.password}
                onChange={handle}
                className="w-full border border-cyan-400 border-opacity-30 bg-white bg-opacity-5 rounded-lg px-5 py-3 text-white focus:border-opacity-100 focus:outline-none transition-all" 
                required 
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 text-white font-bold px-5 py-3 rounded-xl shadow-lg mt-4 text-lg transition-all"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {msg && (
              <p className={`text-center mt-4 text-sm ${msg.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
                {msg}
              </p>
            )}

            <p className="text-center text-gray-400 mt-6">Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">Sign up</Link></p>
          </div>
        </div>
      </main>

      {/* Rest of the UI (Features, FAQ, Footer) stays the same */}
      <Footer />
    </div>
  );
}