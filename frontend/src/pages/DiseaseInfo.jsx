import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DiseaseInfo() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">

      {/* ===== BACKGROUND EFFECTS (SAME AS ANALYSIS PAGE) ===== */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <Navbar />

      {/* ===== MAIN CONTENT ===== */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-14 space-y-14 text-gray-300">

        {/* PAGE TITLE */}
        <header className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-cyan-300">
            Skin Diseases – Information
          </h1>
          <p className="text-gray-400 text-lg">
            Clinically relevant information on commonly occurring skin diseases
            for general reference and awareness.
          </p>
        </header>

        {/* ===== ACNE ===== */}
        <DiseaseBlock
          title="Acne"
          description="Acne is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells."
          symptoms={[
            "Pimples, blackheads, or whiteheads",
            "Oily skin",
            "Redness and swelling",
            "Painful cysts in severe cases",
          ]}
          causes={[
            "Excess oil production",
            "Blocked hair follicles",
            "Bacterial growth",
            "Hormonal changes",
          ]}
        />

        {/* ===== ECZEMA ===== */}
        <DiseaseBlock
          title="Eczema (Atopic Dermatitis)"
          description="Eczema is a chronic inflammatory skin condition characterized by itching, dryness, and irritated skin."
          symptoms={[
            "Dry and itchy skin",
            "Red or inflamed patches",
            "Cracked or scaly skin",
            "Thickened skin in severe cases",
          ]}
          causes={[
            "Genetic predisposition",
            "Allergic reactions",
            "Environmental triggers",
            "Immune system dysfunction",
          ]}
        />

        {/* ===== BENIGN TUMOR ===== */}
        <DiseaseBlock
          title="Benign Tumor"
          description="A benign tumor is a non-cancerous growth of cells that does not spread to other parts of the body."
          symptoms={[
            "Small lump under the skin",
            "Slow growth",
            "Usually painless",
            "Smooth and well-defined borders",
          ]}
          causes={[
            "Abnormal cell growth",
            "Genetic factors",
            "Hormonal changes",
            "Tissue injury",
          ]}
        />

        {/* ===== FUNGAL ===== */}
        <DiseaseBlock
          title="Fungal Infection"
          description="Fungal infections are skin conditions caused by fungi that thrive in warm and moist environments."
          symptoms={[
            "Red, itchy rash",
            "Ring-shaped patches",
            "Peeling or cracked skin",
            "Burning sensation",
          ]}
          causes={[
            "Excess moisture and sweat",
            "Poor hygiene",
            "Weakened immune system",
            "Contact with infected surfaces",
          ]}
        />

        {/* ===== SKIN CANCER ===== */}
        <DiseaseBlock
          title="Skin Cancer"
          description="Skin cancer is the abnormal growth of skin cells, often caused by prolonged exposure to ultraviolet radiation."
          symptoms={[
            "Unusual moles or growths",
            "Changes in size, shape, or color",
            "Bleeding or non-healing sores",
            "Dark or irregular patches",
          ]}
          causes={[
            "Excessive UV exposure",
            "Genetic factors",
            "Weak immune system",
            "Exposure to harmful chemicals",
          ]}
        />

        {/* ===== DISCLAIMER ===== */}
        <section className="border border-red-500 rounded-xl p-6 bg-black/40 text-sm text-center">
          ⚠️ <span className="text-red-400 font-semibold">Medical Disclaimer:</span>
          This information is intended for educational purposes only and does not
          substitute professional medical diagnosis or treatment.
        </section>

      </div>

      <Footer />
    </div>
  );
}

/* ===== REUSABLE DISEASE CARD ===== */
function DiseaseBlock({ title, description, symptoms, causes }) {
  return (
    <section className="bg-black bg-opacity-50 border border-gray-700 rounded-xl p-8 shadow-xl hover:scale-105 transition">
      <h2 className="text-2xl font-semibold text-cyan-400 mb-3">
        {title}
      </h2>

      <p className="mb-4">{description}</p>

      <div className="mb-3">
        <h3 className="text-lg font-medium text-blue-400">
          Common Symptoms
        </h3>
        <ul className="list-disc list-inside">
          {symptoms.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-medium text-yellow-400">
          Causes
        </h3>
        <ul className="list-disc list-inside">
          {causes.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}