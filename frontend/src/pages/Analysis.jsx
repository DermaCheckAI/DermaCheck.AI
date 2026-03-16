import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Adjust path to your firebase.js
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Analysis() {
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  
  // Results from Flask Backend
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  // --- 1. FIREBASE AUTH LOGIC (From backend_prod) ---
  useEffect(() => {
    // onAuthStateChanged is safer than checking localStorage manually
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.log("Unauthorized access, redirecting to login...");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // --- 2. IMAGE UPLOAD & ANALYSIS (To Flask Backend) ---
  const handleUpload = async () => {
    if (!image) {
      setMessage("❌ Please select or capture an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      setMessage("Uploading to server for analysis...");
      
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setPrediction(data.prediction || "Unknown");
        setConfidence(data.confidence || 0);
        setSymptoms(data.symptoms || data.details?.symptoms || "No symptoms provided by model.");
        setAdvice(data.advice || data.details?.advice || "No specific advice available.");
        setMessage("Analysis Complete ✅");
      } else {
        setMessage("Error: " + (data.error || "Backend failed to process image"));
      }
    } catch (err) {
      console.error("Backend Connection Error:", err);
      setMessage("❌ Failed to connect to Python backend (Is Flask running?)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      
      {/* Background Glows (UI from frontend_prod) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <Navbar />

      <div className="relative z-10 p-10 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-center text-cyan-300 mb-10 tracking-widest">
          SKIN DISEASES CLASSIFICATION
        </h1>

        {/* Upload Card */}
        <div className="text-center bg-gray-800 bg-opacity-40 p-8 rounded-2xl border border-gray-700 shadow-2xl backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6">Analyze New Scan</h2>

          {preview && (
            <div className="mb-6 flex justify-center">
              <img src={preview} alt="Preview" className="w-64 h-64 object-cover rounded-xl border-4 border-cyan-500 shadow-2xl" />
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <label className="bg-yellow-400 hover:bg-yellow-300 text-black px-8 py-3 rounded-full cursor-pointer font-bold transition-all transform hover:scale-105 shadow-lg">
              {image ? "Change Image" : "Choose Image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setImage(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
                    setMessage("");
                  }
                }}
              />
            </label>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              className="text-cyan-400 hover:text-cyan-200 underline text-sm transition"
            >
              {cameraOn ? "Close Camera" : "Use Device Camera"}
            </button>
          </div>

          {cameraOn && (
            <div className="mt-4 p-4 border-2 border-dashed border-gray-600 rounded-lg">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="text-white"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  setPreview(URL.createObjectURL(e.target.files[0]));
                  setCameraOn(false);
                }}
              />
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={loading}
            className={`mt-10 px-16 py-4 rounded-full text-white text-xl font-black uppercase tracking-wider transition-all shadow-xl
              ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-105 active:scale-95"}`}
          >
            {loading ? "Analyzing..." : "Start Analysis"}
          </button>

          {message && (
            <p className={`mt-6 font-medium ${message.includes("❌") ? "text-red-400" : "text-green-400"}`}>
              {message}
            </p>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-black bg-opacity-60 border border-green-500 rounded-2xl p-8 text-center shadow-lg hover:border-green-300 transition-colors">
            <h2 className="text-gray-400 uppercase text-sm tracking-widest">Confidence Score</h2>
            <p className="text-5xl font-black text-green-400 mt-2">
              {confidence ? `${confidence}%` : "0%"}
            </p>
          </div>

          <div className="bg-black bg-opacity-60 border border-pink-500 rounded-2xl p-8 text-center shadow-lg hover:border-pink-300 transition-colors">
            <h2 className="text-gray-400 uppercase text-sm tracking-widest">Disease Identity</h2>
            <p className="text-3xl font-black text-pink-400 mt-2">
              {prediction || "---"}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="mt-8 space-y-6">
          <div className="bg-black bg-opacity-60 border border-blue-500 rounded-2xl p-8 shadow-lg">
            <h3 className="text-blue-400 font-bold mb-2 uppercase text-xs">Reported Symptoms</h3>
            <p className="text-lg text-gray-200 leading-relaxed">
              {symptoms || "Results will be displayed here."}
            </p>
          </div>

          <div className="bg-black bg-opacity-60 border border-yellow-500 rounded-2xl p-8 shadow-lg">
            <h3 className="text-yellow-500 font-bold mb-2 uppercase text-xs">Medical Advice</h3>
            <p className="text-lg text-gray-200 leading-relaxed italic">
              {advice || "Expert guidance will appear after scan."}
            </p>
          </div>
        </div>

        {/* Care Guidance Navigation */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/suggestions", { state: { disease: prediction } })}
            disabled={!prediction}
            className={`px-14 py-5 rounded-full font-black text-xl transition-all shadow-2xl ${
              prediction 
              ? "bg-gradient-to-r from-green-400 to-cyan-500 text-black hover:scale-110 active:scale-105" 
              : "bg-gray-800 text-gray-600 cursor-not-allowed"
            }`}
          >
            🩺 Get Detailed Care Guidance
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}