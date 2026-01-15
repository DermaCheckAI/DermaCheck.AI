import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setMsg('Login successful! Redirecting...');
      setTimeout(() => (window.location.href = '/dashboard'), 2000);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-pulse"></div>
        <div className="absolute -bottom-8 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-pulse" style={{ animationDelay: '4s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-20"></div>
        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <Navbar showRegisterButton={true} />

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-20 gap-20 px-8">
          {/* Left Column */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-8 leading-tight">
              Welcome to DermaCheck.AI
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Your AI-powered dermatology assistant for fast, accurate skin Diseases detection, analysis and recommendations!
            </p>

            <div className="flex gap-4 flex-col md:flex-row">
              <Link to="/register" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all text-lg text-center">
                Get Started
              </Link>
              <button onClick={scrollToFeatures} className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black font-bold px-8 py-4 rounded-xl transition-all text-lg">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Column: Login Form */}
          <div className="flex-1 max-w-md w-full bg-white bg-opacity-5 backdrop-blur-lg border border-cyan-400 border-opacity-30 rounded-2xl shadow-2xl shadow-cyan-500/20 p-10 hover:border-opacity-50 transition-all">
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center">Login</h2>
            <form onSubmit={submit} className="flex flex-col gap-6">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handle}
                className="w-full border border-cyan-400 border-opacity-30 bg-white bg-opacity-5 backdrop-blur rounded-lg px-5 py-3 text-lg text-white placeholder-gray-400 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30 transition-all"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handle}
                className="w-full border border-cyan-400 border-opacity-30 bg-white bg-opacity-5 backdrop-blur rounded-lg px-5 py-3 text-lg text-white placeholder-gray-400 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30 transition-all"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-cyan-500/50 mt-4 text-lg transition-all"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {msg && (
              <p className={`text-center mt-4 text-sm ${msg.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
                {msg}
              </p>
            )}

            <p className="text-center text-gray-400 mt-6">
              Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">Sign up</Link>
            </p>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features-section" className="relative z-10 w-full bg-gradient-to-b from-transparent via-gray-900 to-gray-900 py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Why Choose DermaCheck.AI?</h2>
          <p className="text-center text-gray-300 text-lg mb-16">Advanced AI technology for accurate skin analysis and personalized recommendations</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Examples */}
            <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-cyan-400 border-opacity-30 rounded-2xl p-8 hover:border-opacity-50 transition-all group">
              <div className="text-4xl mb-4 text-cyan-400">🔬</div>
              <h3 className="text-2xl font-bold text-cyan-300 mb-3">AI-Powered Analysis</h3>
              <p className="text-gray-300">Advanced machine learning algorithms analyze skin conditions with accuracy in seconds.</p>
            </div>
            <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-cyan-400 border-opacity-30 rounded-2xl p-8 hover:border-opacity-50 transition-all group">
              <div className="text-4xl mb-4 text-blue-400">📋</div>
              <h3 className="text-2xl font-bold text-blue-300 mb-3">Personalized Reports</h3>
              <p className="text-gray-300">Get detailed analysis reports with specific recommendations tailored to your skin type and condition.</p>
            </div>
            <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-cyan-400 border-opacity-30 rounded-2xl p-8 hover:border-opacity-50 transition-all group">
              <div className="text-4xl mb-4 text-purple-400">⚡</div>
              <h3 className="text-2xl font-bold text-purple-300 mb-3">Instant Results</h3>
              <p className="text-gray-300">Get analysis results in seconds with real-time skin condition assessment.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-full p-3 shadow-lg hover:shadow-cyan-500/50 transition-all transform hover:scale-110 duration-300"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
