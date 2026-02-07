import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLanguage, translations } from '../language'
import { useTranslation } from "react-i18next"


export default function Home() {
  

  const { lang } = useLanguage()
  const t = translations[lang]

  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [showScrollButton, setShowScrollButton] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    try {
      // Replace with your backend URL
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      localStorage.setItem('token', data.token)
      setMsg(t.loginSuccess)

      setTimeout(() => window.location.href = '/dashboard', 1500)
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-24 flex flex-col md:flex-row gap-20">

        <div className="flex-1">
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
            {t.heroTitle}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {t.heroSubtitle}
          </p>

          <Link
            to="/register"
            className="bg-cyan-500 px-8 py-4 rounded-xl text-white font-bold shadow-lg"
          >
            {t.getStarted}
          </Link>
        </div>

        {/* Login */}
        <div className="flex-1 max-w-md bg-white/5 backdrop-blur border border-cyan-400/30 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-cyan-400 mb-6 text-center">
            {t.login}
          </h2>

          <form onSubmit={submit} className="flex flex-col gap-5">
            <input
              type="email"
              name="email"
              placeholder={t.email}
              onChange={handle}
              className="input"
              required
            />
            <input
              type="password"
              name="password"
              placeholder={t.password}
              onChange={handle}
              className="input"
              required
            />
            <button className="btn-primary">
              {loading ? t.loading : t.login}
            </button>
          </form>

          {msg && <p className="text-center mt-4 text-sm text-cyan-400">{msg}</p>}
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