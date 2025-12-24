import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Analysis() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  
  // BACKEND TOKEN CHECK + USER FETCH (COMMENTED NOW)
  
  /*
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("http://localhost:5000/api/user/me", {
      headers: { Authorization: Bearer ${token} },
    })
      .then(res => res.json())
      .then(data => {
        console.log("User:", data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);
  */

  
  // FRONTEND DEMO MODE (ACTIVE)
  
  useEffect(() => {
    console.log("Analysis running in DEMO MODE. No backend connected.");
  }, []);

  
  // IMAGE UPLOAD FUNCTION (DEMO)
 
  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select an image first.");
      return;
    }

    setMessage("Demo: Image uploaded successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">

      {/* Background Animations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>

        <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Navbar />

      {/* MAIN CONTENT */}
      <div className="relative z-10 p-10 max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-cyan-300 mb-10">
          SKIN DISEASES CLASSIFICATION
        </h1>

        
        {/* Stats Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

          <div className="bg-black bg-opacity-50 border border-cyan-500 rounded-xl p-6 text-center shadow-xl hover:scale-105 transition">
            <h2 className="text-gray-300">Total Scans</h2>
            <p className="text-5xl font-bold text-cyan-400 mt-3">235</p>
          </div>

          <div className="bg-black bg-opacity-50 border border-green-500 rounded-xl p-6 text-center shadow-xl hover:scale-105 transition">
            <h2 className="text-gray-300">Accuracy</h2>
            <p className="text-5xl font-bold text-green-400 mt-3">95%</p>
          </div>

          <div className="bg-black bg-opacity-50 border border-pink-500 rounded-xl p-6 text-center shadow-xl hover:scale-105 transition">
            <h2 className="text-gray-300">Diseases Detected</h2>
            <p className="text-5xl font-bold text-pink-400 mt-3">17</p>
          </div>

        </div>

        
        {/* Upload Section */}
       
        <div className="text-center mt-10 bg-gray-800 bg-opacity-40 p-6 rounded-xl border border-gray-700">

          <h2 className="text-2xl font-bold text-gray-200 mb-6">Upload Image</h2>

          {/* File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
            className="block mx-auto mb-4 text-white"
          />

          {/* Image Preview */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mx-auto w-60 rounded-lg shadow-xl mb-4"
            />
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="px-12 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xl font-bold hover:scale-105 transition-all shadow-lg"
          >
            Upload to Server
          </button>

          {/* Success/Error Message */}
          {message && <p className="text-green-400 mt-4">{message}</p>}
        </div>

        
        {/* Recent Analysis Section — (THIS WAS MISSING EARLIER) */}
        
        <div className="bg-black bg-opacity-40 p-6 rounded-xl border border-gray-700 mt-14">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Recent Analysis</h2>

          <div className="space-y-4 text-gray-300">

            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span>image_05.jpg</span>
              <span className="text-green-300">Eczema (87%)</span>
              <span>Today</span>
            </div>

            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span>photo_123.png</span>
              <span className="text-pink-300">Rosacea (82%)</span>
              <span>Yesterday</span>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}