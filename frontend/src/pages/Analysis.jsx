import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Ensure this path is correct
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

  // 1. Firebase Auth Guard
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        // If not logged in, send to Register/Login
        navigate("/register");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // 2. Handle Flask Backend Upload
 // 2. Handle Flask Backend Upload
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
      
      // Reset previous results while loading new ones
      setPrediction("");
      setConfidence("");
      setSymptoms("");
      setAdvice("");

      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // These keys now match your updated app.py exactly
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
      
      {/* Background UI */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <Navbar />

      <div className="relative z-10 p-10 max-w-5xl mx-auto w-full">
        <h1 className="text-4xl font-bold text-center text-cyan-300 mb-10">
          SKIN DISEASES CLASSIFICATION
        </h1>

        {/* Upload Box */}
        <div className="text-center bg-gray-800 bg-opacity-40 p-8 rounded-2xl border border-gray-700 shadow-2xl">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6">Upload Image</h2>
          
          {preview && (
            <img src={preview} alt="preview" className="mx-auto w-60 rounded-lg shadow-xl mb-6 border-2 border-cyan-500" />
          )}

          <label className="bg-yellow-400 text-black px-8 py-2 rounded-full cursor-pointer font-bold hover:bg-yellow-300 transition inline-block">
            {image ? "Change File" : "Choose File"}
            <input 
              type="file" 
              accept="image/*" 
              hidden 
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
              }} 
            />
          </label>

          <div className="mt-8">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-12 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xl font-bold hover:scale-105 transition shadow-lg"
            >
              {loading ? "Analyzing..." : "Start Analysis"}
            </button>
          </div>
          {message && <p className="text-cyan-400 mt-4">{message}</p>}
        </div>

        {/* Results Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <div className="bg-black bg-opacity-50 border border-green-500 rounded-xl p-8 text-center shadow-xl">
            <h2 className="text-gray-300">Confidence Score</h2>
            <p className="text-4xl font-bold text-green-400 mt-2">{confidence ? `${confidence}%` : "0%"}</p>
          </div>
          <div className="bg-black bg-opacity-50 border border-pink-500 rounded-xl p-8 text-center shadow-xl">
            <h2 className="text-gray-300">Classification</h2>
            <p className="text-4xl font-bold text-pink-400 mt-2">{prediction || "---"}</p>
          </div>
        </div>

        {/* Info Cards */}
        <div className="mt-8 space-y-4">
          <div className="bg-black bg-opacity-50 border border-blue-500 rounded-xl p-6 shadow-xl">
            <h3 className="text-blue-400 font-bold mb-2">Symptoms</h3>
            <p className="text-gray-200">{symptoms || "Upload to see details"}</p>
          </div>
          <div className="bg-black bg-opacity-50 border border-yellow-500 rounded-xl p-6 shadow-xl">
            <h3 className="text-yellow-500 font-bold mb-2">Advice</h3>
            <p className="text-gray-200">{advice || "Expert advice will appear here"}</p>
          </div>
        </div>

        {/* Navigation Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate("/suggestions", { state: { disease: prediction } })}
            disabled={!prediction}
            className={`px-10 py-4 rounded-full font-bold text-lg transition-all ${
              prediction ? "bg-green-500 text-black hover:scale-105" : "bg-gray-700 text-gray-500"
            }`}
          >
            🩺 Care Guidance
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}