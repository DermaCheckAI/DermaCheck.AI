import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Analysis() {
  const navigate = useNavigate();

  // State Management
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Results
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [advice, setAdvice] = useState("");

  // Handle Flask Backend Upload
  const handleUpload = async () => {
    if (!image) {
      setMessage("❌ Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setLoading(true);
      setMessage("Processing scan...");
      
      setPrediction("");
      setConfidence("");
      setSymptoms("");
      setAdvice("");

          
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:10000";

    const res = await fetch(`${API_URL}/predict`, {
      method: "POST",
      body: formData,
    });
      

      const data = await res.json();

      if (res.ok) {
        setPrediction(data.prediction);
        setConfidence(data.confidence);
        setSymptoms(data.symptoms); 
        setAdvice(data.advice);
        setMessage("✅ Analysis Complete");
      } else {
        setMessage("Error: " + (data.error || "Server error"));
      }
    } catch (err) {
      setMessage("❌ Backend not connected. Ensure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <Navbar />

      <div className="relative z-10 p-10 max-w-5xl mx-auto w-full">
        
        {/* Modern Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="mb-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-all group"
        >
          <div className="p-2 rounded-full border border-cyan-500/30 group-hover:border-cyan-400 group-hover:bg-cyan-400/10 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
        </button>

        <h1 className="text-4xl font-bold text-center text-cyan-300 mb-10 tracking-tight">
          SKIN DISEASES CLASSIFICATION
        </h1>

        <div className="text-center bg-gray-800 bg-opacity-40 backdrop-blur-md p-8 rounded-2xl border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6">Upload Image</h2>
          
          {preview && (
            <div className="relative inline-block mb-6">
              <img src={preview} alt="preview" className="mx-auto w-64 rounded-lg shadow-2xl border-2 border-cyan-500 object-cover" />
              <div className="absolute inset-0 rounded-lg shadow-[inset_0_0_20px_rgba(34,211,238,0.5)] pointer-events-none"></div>
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <label className="bg-yellow-400 text-black px-8 py-3 rounded-xl cursor-pointer font-bold hover:bg-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] transition-all inline-block">
              {image ? "Change File" : "Choose File"}
              <input 
                type="file" 
                accept="image/*" 
                hidden 
                onChange={(e) => {
                  if(e.target.files[0]) {
                    setImage(e.target.files[0]);
                    setPreview(URL.createObjectURL(e.target.files[0]));
                  }
                }} 
              />
            </label>

            <button
              onClick={handleUpload}
              disabled={loading || !image}
              className="px-12 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-bold hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:from-gray-600 disabled:to-gray-700 transition-all shadow-lg"
            >
              {loading ? "Analyzing..." : "Start Analysis"}
            </button>
          </div>
          
          {message && <p className={`mt-4 font-medium ${message.includes('❌') ? 'text-red-400' : 'text-cyan-400'}`}>{message}</p>}
        </div>

        {/* Result Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-black bg-opacity-50 border border-green-500/50 rounded-xl p-8 text-center shadow-xl backdrop-blur-sm">
            <h2 className="text-gray-400 text-sm uppercase tracking-widest">Confidence Score</h2>
            <p className="text-4xl font-bold text-green-400 mt-2">{confidence ? `${confidence}%` : "0%"}</p>
          </div>
          <div className="bg-black bg-opacity-50 border border-pink-500/50 rounded-xl p-8 text-center shadow-xl backdrop-blur-sm">
            <h2 className="text-gray-400 text-sm uppercase tracking-widest">Classification</h2>
            <p className="text-4xl font-bold text-pink-400 mt-2">{prediction || "---"}</p>
          </div>
        </div>

        {/* Information Sections */}
        <div className="mt-8 space-y-4">
          <div className="bg-black bg-opacity-50 border border-blue-500/30 rounded-xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
              <span className="text-lg">🔍</span> Symptoms
            </h3>
            <p className="text-gray-300 leading-relaxed">{symptoms || "Results will appear here after analysis."}</p>
          </div>
          <div className="bg-black bg-opacity-50 border border-yellow-500/30 rounded-xl p-6 shadow-xl backdrop-blur-sm">
            <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
              <span className="text-lg">💡</span> Advice
            </h3>
            <p className="text-gray-300 leading-relaxed">{advice || "Analysis required for expert advice."}</p>
          </div>
        </div>

        {/* Navigation Action */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/suggestions", { state: { disease: prediction } })}
            disabled={!prediction}
            className={`px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-xl ${
              prediction 
              ? "bg-green-500 text-black hover:bg-green-400 hover:shadow-green-500/20 active:scale-95" 
              : "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed"
            }`}
          >
            🩺 View Detailed Care Guidance
          </button>
        </div>
        
      </div>

      <Footer />
    </div>
  );
}