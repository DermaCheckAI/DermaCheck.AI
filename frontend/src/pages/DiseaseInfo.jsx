import { useNavigate } from "react-router-dom"; // ✅ 1. Added Import
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DiseaseInfo() {
  const navigate = useNavigate(); // ✅ 2. Initialize Navigate

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <Navbar />

      {/* MAIN CONTENT */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 space-y-10 text-gray-300">
        
        {/* ✅ BACK BUTTON (Wrapped in a div to keep layout uniform) */}
        <div className="flex justify-start">
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

        {/* PAGE TITLE */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-cyan-300">
            Skin Diseases – Information
          </h1>
          <p className="text-gray-400 text-lg">
            Clinically relevant information for general reference and awareness.
          </p>
        </header>

        {/* DISEASE LIST */}
        <div className="grid grid-cols-1 gap-10">
          <DiseaseBlock
            title="Acne"
            description="Acne is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells."
            symptoms={["Pimples, blackheads, or whiteheads", "Oily skin", "Redness and swelling", "Painful cysts"]}
            causes={["Excess oil production", "Blocked hair follicles", "Bacterial growth", "Hormonal changes"]}
          />

          <DiseaseBlock
            title="Eczema (Atopic Dermatitis)"
            description="Eczema is a chronic inflammatory skin condition characterized by itching, dryness, and irritated skin."
            symptoms={["Dry and itchy skin", "Red or inflamed patches", "Cracked or scaly skin", "Thickened skin"]}
            causes={["Genetic predisposition", "Allergic reactions", "Environmental triggers", "Immune system dysfunction"]}
          />

          <DiseaseBlock
            title="Benign Tumor"
            description="A benign tumor is a non-cancerous growth of cells that does not spread to other parts of the body."
            symptoms={["Small lump under the skin", "Slow growth", "Usually painless", "Smooth borders"]}
            causes={["Abnormal cell growth", "Genetic factors", "Hormonal changes", "Tissue injury"]}
          />

          <DiseaseBlock
            title="Fungal Infection"
            description="Fungal infections thrive in warm and moist environments."
            symptoms={["Red, itchy rash", "Ring-shaped patches", "Peeling or cracked skin", "Burning sensation"]}
            causes={["Excess moisture and sweat", "Poor hygiene", "Weakened immune system", "Infected surfaces"]}
          />

          <DiseaseBlock
            title="Skin Cancer"
            description="Abnormal growth of skin cells, often caused by prolonged UV exposure."
            symptoms={["Unusual moles or growths", "Changes in size/shape/color", "Non-healing sores", "Irregular patches"]}
            causes={["Excessive UV exposure", "Genetic factors", "Weak immune system", "Harmful chemicals"]}
          />
        </div>

        {/* DISCLAIMER */}
        <section className="border border-red-500/50 rounded-xl p-6 bg-black/40 text-sm text-center">
          ⚠️ <span className="text-red-400 font-semibold">Medical Disclaimer:</span> This information is for educational purposes only and does not substitute professional medical diagnosis.
        </section>

      </div>

      <Footer />
    </div>
  );
}

function DiseaseBlock({ title, description, symptoms, causes }) {
  return (
    <section className="bg-black bg-opacity-50 border border-gray-700/50 rounded-2xl p-8 shadow-xl hover:border-cyan-500/40 transition-all duration-300">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">{title}</h2>
      <p className="mb-6 text-gray-300">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-blue-400 mb-2">Symptoms</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
            {symptoms.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">Causes</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-400 text-sm">
            {causes.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}