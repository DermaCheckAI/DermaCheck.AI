import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
export default function Home() {

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {

      // 🔥 Firebase login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const user = userCredential.user;

      // optional storage
      localStorage.setItem("user", JSON.stringify(user));

      setMsg('Login successful! Redirecting...');

      setTimeout(() => {
        window.location.href = "/Analysis";
      }, 1500);

    } catch (error) {

      let message = "Login failed";

      if (error.code === "auth/user-not-found") {
        message = "User not found";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address";
      }

      setMsg(message);

    } finally {
      setLoading(false);
    }
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">

      {/* EVERYTHING BELOW IS EXACTLY YOUR ORIGINAL UI */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-pulse"></div>
        <div className="absolute -bottom-8 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-slow-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <Navbar showRegisterButton={true} />

      <main className="relative z-5 flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between py-20 gap-20 px-8">

          {/* LEFT SIDE */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-8 leading-tight">
              Welcome to DermaCheck.AI
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              Your AI-powered dermatology assistant for fast, accurate skin Diseases classification, analysis and recommendations!
            </p>

            <div className="flex gap-4 flex-col md:flex-row">
              <Link
                to="/register"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 py-4 rounded-xl text-center"
              >
                Get Started
              </Link>

              <button
                onClick={scrollToFeatures}
                className="border-2 border-cyan-400 text-cyan-400 px-8 py-4 rounded-xl"
              >
                Learn More
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          <div className="flex-1 max-w-md w-full bg-white bg-opacity-5 backdrop-blur-lg border border-cyan-400 border-opacity-30 rounded-2xl shadow-2xl shadow-cyan-500/20 p-10">

            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-center">
              Login
            </h2>

            <form onSubmit={submit} className="flex flex-col gap-6">

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handle}
                className="w-full border border-cyan-400 bg-white bg-opacity-5 rounded-lg px-5 py-3 text-lg text-white"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handle}
                className="w-full border border-cyan-400 bg-white bg-opacity-5 rounded-lg px-5 py-3 text-lg text-white"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-5 py-3 rounded-xl"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            {msg && (
              <p className={`text-center mt-4 text-sm ${msg.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
                {msg}
              </p>
            )}

            <p className="text-center text-gray-400 mt-6">
              Don't have an account?
              <Link to="/register" className="text-cyan-400 font-semibold">
                Sign up
              </Link>
            </p>

          </div>
        </div>
      </main>

      <Footer />

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-cyan-500 text-white rounded-full p-3"
        >
          ↑
        </button>
      )}
    </div>
  );
}
