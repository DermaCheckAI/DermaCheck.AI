import { useLocation, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Suggestions() {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const location = useLocation();
  const disease = location.state?.disease || "Acne";

  const doctors = [
    {
      name: "Dr. Anjali Patil",
      specialization: "Dermatologist",
      hospital: "City Skin Care Clinic",
      phone: "+91 98765 43210",
    },
    {
      name: "Dr. Rahul Deshmukh",
      specialization: "Skin & Hair Specialist",
      hospital: "DermaLife Hospital",
      phone: "+91 91234 56789",
    },
    {
      name: "Dr. Sneha Kulkarni",
      specialization: "Cosmetic Dermatologist",
      hospital: "Glow Skin Center",
      phone: "+91 99887 66554",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <Navbar />

      {/* Standardized Content Wrapper - Using max-w-6xl for uniformity */}
      <main className="relative z-10 flex-1 py-14 px-6 max-w-6xl mx-auto w-full">

        {/* ✅ Uniform Back Button */}
        <div className="flex justify-start mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all group"
          >
            <div className="p-2 rounded-full border border-cyan-500/30 group-hover:border-cyan-400 group-hover:bg-cyan-400/10 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
           
          </button>
        </div>

        {/* Page title */}
        <header className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent uppercase tracking-tight">
            Care Guidance
          </h2>
          {/* Disease badge */}
          <div className="inline-block px-6 py-2 rounded-full bg-black/40 border border-cyan-400/50 text-cyan-300 font-semibold shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            🧬 Detected Condition: <span className="text-white ml-1">{disease}</span>
          </div>
        </header>

        {/* ==============================
            ✅ DO / ❌ DON'T / ⚠️ CONSULT
           ============================== */}
        <section className="grid md:grid-cols-3 gap-8 mb-20">

          {/* DO */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20 rounded-3xl p-8 shadow-xl hover:border-green-400/40 transition-all">
            <h3 className="text-2xl font-bold text-green-400 mb-4 flex items-center gap-2">
              <span>✅</span> DO
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-2"><span>🧼</span> Clean skin gently twice daily</li>
              <li className="flex gap-2"><span>💧</span> Keep skin hydrated</li>
              <li className="flex gap-2"><span>🧴</span> Use approved products</li>
              <li className="flex gap-2"><span>🥗</span> Maintain healthy diet</li>
            </ul>
          </div>

          {/* DON'T */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border border-yellow-400/20 rounded-3xl p-8 shadow-xl hover:border-yellow-400/40 transition-all">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span>❌</span> DON’T
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-2"><span>🚫</span> Do not scratch area</li>
              <li className="flex gap-2"><span>🧪</span> Avoid harsh chemicals</li>
              <li className="flex gap-2"><span>🍔</span> Reduce oily / junk food</li>
              <li className="flex gap-2"><span>☀️</span> Avoid excessive sun</li>
            </ul>
          </div>

          {/* WHEN TO CONSULT */}
          <div className="bg-gradient-to-br from-red-500/10 to-pink-600/10 border border-red-400/20 rounded-3xl p-8 shadow-xl hover:border-red-400/40 transition-all">
            <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span>⚠️</span> CONSULT DOCTOR
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex gap-2"><span>🔥</span> Pain/swelling increases</li>
              <li className="flex gap-2"><span>⏳</span> No improvement (2-3 wks)</li>
              <li className="flex gap-2"><span>🦠</span> Signs of infection</li>
              <li className="flex gap-2"><span>📈</span> Condition worsens</li>
            </ul>
          </div>

        </section>

        {/* ==============================
            🧑‍⚕️ Doctor Consult Section
           ============================== */}
        <section className="pb-10">
          <h3 className="text-3xl font-bold text-center mb-10 text-gray-200">
            🧑‍⚕️ Recommended Specialists
          </h3>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doc, index) => (
              <div
                key={index}
                className="bg-black/40 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                <h4 className="text-xl font-bold text-cyan-400 mb-2">{doc.name}</h4>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-300 flex items-center gap-2 text-sm">
                    <span className="text-cyan-500">👨‍⚕️</span> {doc.specialization}
                  </p>
                  <p className="text-gray-400 flex items-center gap-2 text-sm">
                    <span className="text-cyan-500">🏥</span> {doc.hospital}
                  </p>
                </div>

                <a
                  href={`tel:${doc.phone}`}
                  className="flex justify-center items-center gap-2 w-full bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:from-cyan-500 hover:to-blue-600 active:scale-95 transition-all"
                >
                  📞 Contact Now
                </a>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}