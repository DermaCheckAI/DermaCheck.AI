import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Suggestions() {

  // 🔹 disease from Analysis page (demo safe)
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

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
      </div>

      <Navbar />

      <main className="relative z-10 flex-1 py-20 px-6">

        {/* Page title */}
        <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Care Guidance
        </h2>

        {/* Disease badge */}
        <div className="flex justify-center mb-12">
          <div className="px-6 py-2 rounded-full bg-black/40 border border-cyan-400 text-cyan-300 font-semibold">
            🧬 Detected Condition: {disease}
          </div>
        </div>

        {/* ==============================
            ✅ DO / ❌ DON'T / ⚠️ CONSULT
           ============================== */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 mb-20">

          {/* DO */}
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10
                          border border-green-400/30 rounded-3xl p-8 shadow-xl
                          hover:scale-105 transition">
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              ✅ DO
            </h3>
            <ul className="space-y-3 text-gray-200">
              <li>🧼 Clean skin gently twice daily</li>
              <li>💧 Keep skin hydrated</li>
              <li>🧴 Use dermatologist-approved products</li>
              <li>🥗 Maintain healthy diet</li>
            </ul>
          </div>

          {/* DON'T */}
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-600/10
                          border border-yellow-400/30 rounded-3xl p-8 shadow-xl
                          hover:scale-105 transition">
            <h3 className="text-2xl font-bold text-yellow-300 mb-4">
              ❌ DON’T
            </h3>
            <ul className="space-y-3 text-gray-200">
              <li>🚫 Do not scratch affected area</li>
              <li>🧪 Avoid harsh chemicals</li>
              <li>🍔 Reduce oily / junk food</li>
              <li>☀️ Avoid excessive sun exposure</li>
            </ul>
          </div>

          {/* WHEN TO CONSULT */}
          <div className="bg-gradient-to-br from-red-500/10 to-pink-600/10
                          border border-red-400/30 rounded-3xl p-8 shadow-xl
                          hover:scale-105 transition">
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              ⚠️ Consult Doctor If
            </h3>
            <ul className="space-y-3 text-gray-200">
              <li>🔥 Pain or swelling increases</li>
              <li>⏳ No improvement after 2–3 weeks</li>
              <li>🦠 Signs of infection</li>
              <li>📈 Condition worsens suddenly</li>
            </ul>
          </div>

        </section>

        {/* ==============================
            🧑‍⚕️ Doctor Consult
           ============================== */}
        <section>
          <h3 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            🧑‍⚕️ Consult a Dermatologist
          </h3>

          <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doc, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-lg border border-cyan-400/30
                           rounded-2xl shadow-xl p-6 hover:scale-105 transition"
              >
                <h4 className="text-xl font-bold text-cyan-400 mb-2">
                  {doc.name}
                </h4>

                <p className="text-gray-300">
                  👨‍⚕️ {doc.specialization}
                </p>

                <p className="text-gray-400 mb-3">
                  🏥 {doc.hospital}
                </p>

                <a
                  href={`tel:${doc.phone}`}
                  className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600
                             text-white font-semibold px-4 py-2 rounded-lg
                             shadow-lg hover:shadow-cyan-500/50 transition-all"
                >
                  📞 {doc.phone}
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
