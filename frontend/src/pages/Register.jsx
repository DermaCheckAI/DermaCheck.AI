import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Register() {
  const [form, setForm] = useState({
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    
    if (form.password !== form.confirmPassword) {
      setMsg('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      // Replace with your backend URL
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobile: form.mobile,
          email: form.email,
          password: form.password,
          fullName: form.fullName
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      setMsg('Registration successful! Redirecting to login...');
      setTimeout(() => window.location.href = '/', 2000);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-pulse"></div>
        <div className="absolute -bottom-8 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-20"></div>
      </div>

      {/* Navigation */}
      <Navbar showRegisterButton={false} />

      {/* Main Content */}
      <main className="relative z-5 flex-1 flex items-center justify-center py-20">
        <div className="w-full max-w-md">
          <div className="bg-white bg-opacity-5 backdrop-blur-lg border border-cyan-400 border-opacity-30 rounded-2xl shadow-2xl shadow-cyan-500/20 p-10">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center">Create Account</h2>
            
            <form onSubmit={submit} className="flex flex-col gap-5">
              <input 
                type="text" 
                name="fullName"
                placeholder="Full Name" 
                value={form.fullName}
                onChange={handle}
                className="w-full border border-cyan-400 border-opacity-30 bg-white bg-opacity-5 backdrop-blur rounded-lg px-5 py-3 text-white placeholder-gray-400 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30 transition-all" 
                required 
              />
              <input 
                type="tel" 
                name="mobile"
                placeholder="Mobile Number" 
                value={form.mobile}
                onChange={handle}
                className="w-full border border-cyan-400 border-opacity-30 bg-white bg-opacity-5 backdrop-blur rounded-lg px-5 py-3 text-white placeholder-gray-400 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30 transition-all" 
                required 
              />
              <input 
                type="email" 
                name="email"
                placeholder="Email" 
                value={form.email}
                onChange={handle}
                className="w-full border border-cyan-400 border-opacity-30 bg-white bg-opacity-5 backdrop-blur rounded-lg px-5 py-3 text-white placeholder-gray-400 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30 transition-all" 
                required 
              />
              <input 
                type="password" 
                name="password"
                placeholder="Password" 
                value={form.password}
                onChange={handle}
                className="w-full border border-cyan-400 border-opacity-30 bg-white bg-opacity-5 backdrop-blur rounded-lg px-5 py-3 text-white placeholder-gray-400 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30 transition-all" 
                required 
              />
              <input 
                type="password" 
                name="confirmPassword"
                placeholder="Confirm Password" 
                value={form.confirmPassword}
                onChange={handle}
                className="w-full border border-cyan-400 border-opacity-30 bg-white bg-opacity-5 backdrop-blur rounded-lg px-5 py-3 text-white placeholder-gray-400 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-30 transition-all" 
                required 
              />
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold px-5 py-3 rounded-xl shadow-lg hover:shadow-cyan-500/50 mt-2 text-lg transition-all"
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            {msg && (
              <p className={`text-center mt-4 text-sm ${msg.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
                {msg}
              </p>
            )}

            <p className="text-center text-gray-400 mt-6">Already have an account? <Link to="/" className="text-cyan-400 hover:text-cyan-300 font-semibold">Login</Link></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
