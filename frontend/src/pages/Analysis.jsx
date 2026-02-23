import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Analysis() {
  const navigate = useNavigate();

  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  // ==============================
  // 🔹 DEMO MODE (backend not connected)
  // ==============================
  useEffect(() => {
    console.log("Running in DEMO mode");
  }, []);

  // ==============================
  // 🔹 ANALYSIS (SIMULATED)
  // ==============================
  const handleUpload = async () => {
    if (!image) {
      setMessage("❌ Please select or capture an image first");
      return;
    }

    // demo analysis result
    setMessage("✔️ Image analyzed successfully");
    setAnalysisDone(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">

      {/* ==============================
          🔹 Background Effects
         ============================== */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <Navbar />

      {/* ==============================
          🔹 MAIN CONTENT
         ============================== */}
      <div className="relative z-10 p-10 max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-cyan-300 mb-10">
          SKIN DISEASES CLASSIFICATION
        </h1>

        {/* ==============================
            🔹 UPLOAD SECTION
           ============================== */}
        <div className="text-center bg-gray-800/40 p-6 rounded-xl border border-gray-700">

          <h2 className="text-2xl font-bold text-yellow-300 mb-6">
            Upload Image for Detection
          </h2>

          {/* File Upload */}
          <label className="bg-yellow-400 text-black px-4 py-2 rounded cursor-pointer font-semibold">
            Choose File
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
                setAnalysisDone(false); // reset on new image
                setMessage("");
              }}
            />
          </label>

          <p className="text-gray-400 mt-2">
            {image ? image.name : "No file chosen"}
          </p>

          {/* Camera Button */}
          <div className="mt-4">
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className="bg-cyan-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transition"
            >
              {cameraOn ? "Close Camera" : "Open Camera"}
            </button>
          </div>

          {/* Camera Capture */}
          {cameraOn && (
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="block mx-auto mt-4 text-white"
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
                setCameraOn(false);
                setAnalysisDone(false);
                setMessage("");
              }}
            />
          )}

          {/* Analyze Button */}
          <button
            onClick={handleUpload}
            className="mt-6 px-12 py-3 rounded-full 
                       bg-gradient-to-r from-cyan-500 to-purple-600
                       text-white text-xl font-bold
                       hover:scale-105 transition-all shadow-lg"
          >
            Analysis
          </button>

          {/* Status Message */}
          {message && (
            <p className="text-green-400 mt-4 font-semibold">
              {message}
            </p>
          )}
        </div>

        {/* ==============================
            🔽 RESULTS (VISIBLE AFTER ANALYSIS)
           ============================== */}
        {analysisDone && (
          <>
            {/* Result Cards */}
            <div className="grid md:grid-cols-2 gap-10 mt-16 mb-10">

              <div className="bg-black/50 border border-green-500 rounded-xl p-8 text-center shadow-xl hover:scale-105 transition">
                <h2 className="text-gray-300 text-xl">Confidence Score</h2>
                <p className="text-6xl font-bold text-green-400 mt-3">95%</p>
              </div>

              <div className="bg-black/50 border border-pink-500 rounded-xl p-8 text-center shadow-xl hover:scale-105 transition">
                <h2 className="text-gray-300 text-xl">Disease Classified</h2>
                <p className="text-5xl font-bold text-pink-400 mt-3">
                  Acne
                </p>
              </div>
            </div>

            {/* Symptoms */}
            <div className="bg-black/50 border border-blue-500 rounded-xl p-8 text-center shadow-xl mb-12">
              <h2 className="text-gray-300 text-xl mb-3">Symptoms</h2>
              <p className="text-gray-400">
                Pimples, redness, inflammation, oily skin
              </p>
            </div>
          </>
        )}

        {/* ==============================
            🔥 CARE GUIDANCE CTA (ALWAYS VISIBLE)
           ============================== */}
        <div className="mt-14 text-center">
          <p className="text-gray-300 mb-4 text-lg">
            {analysisDone
              ? "Proceed to care guidance and medical recommendations"
              : "You can explore care guidance even in demo mode"}
          </p>

          <button
            onClick={() =>
              navigate("/suggestions", {
                state: { disease: "Acne" }, // demo data
              })
            }
            className={`px-14 py-4 rounded-full 
              ${
                analysisDone
                  ? "bg-gradient-to-r from-green-400 to-cyan-500"
                  : "bg-gradient-to-r from-gray-400 to-gray-500"
              }
              text-black text-xl font-bold
              hover:scale-110 transition-all shadow-xl`}
          >
            🩺 Care Guidance
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
}
