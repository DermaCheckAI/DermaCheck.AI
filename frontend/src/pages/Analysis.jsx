import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Analysis() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  // DEMO MODE
  useEffect(() => {
    console.log("Running in demo mode");
  }, []);

  // UPLOAD FUNCTION
  const handleUpload = async () => {
    if (!image) {
      setMessage("Please select or capture an image first.");
      return;
    }
    setMessage("Demo: Image uploaded successfully!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <Navbar />

      {/* MAIN */}
      <div className="relative z-10 p-10 max-w-5xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center text-cyan-300 mb-10">
          SKIN DISEASES CLASSIFICATION
        </h1>

        {/* Upload Section */}
        <div className="text-center mt-10 bg-gray-800 bg-opacity-40 p-6 rounded-xl border border-gray-700">

          <h2 className="text-2xl font-bold text-yellow-300 mb-6">
            Upload Image for Detection
          </h2>

          {/* Choose File */}
          <label className="bg-yellow-400 text-black px-4 py-2 rounded cursor-pointer font-semibold">
            Choose File
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

          <p className="text-gray-400 mt-2">
            {image ? image.name : "No file chosen"}
          </p>

         {/* Camera Option */}
          <div className="mt-4">
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className="bg-cyan-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transition"
            >
              {cameraOn ? "Close Camera" : "Open Camera"}
            </button>
          </div>

          {/* Live Capture */}
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
              }}
            />
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            className="mt-6 px-12 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xl font-bold hover:scale-105 transition-all shadow-lg"
          >
            Analysis 
          </button>

          {message && <p className="text-green-400 mt-4">{message}</p>}


        </div>


         {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12 mt-16 mb-11">

          <div className="flex-1 max-w-md w-full bg-black bg-opacity-50 border border-green-500 rounded-xl p-8 text-center shadow-xl hover:scale-105 transition">
            <h2 className="text-gray-300 text-xl">Confidence Score</h2>
            <p className="text-6xl font-bold text-green-400 mt-3">95%</p>
          </div>

          <div className="w-full bg-black bg-opacity-50 border border-pink-500 rounded-xl p-8 text-center shadow-xl hover:scale-105 transition">
            <h2 className="text-gray-300 text-xl">Diseases classified</h2>
            <p className="text-6xl font-bold text-pink-400 mt-3">Acne</p>
          </div>

        </div>
        
        <div className="w-full bg-black bg-opacity-50 border border-blue-500 rounded-xl p-8 text-center shadow-xl hover:scale-105 transition">
            <h2 className="text-gray-300 text-xl">Symptoms</h2>
            {/* <p className="text-6xl font-bold text-pink-400 mt-3">Acne</p> */}

          </div>

      </div>

      <Footer />

    </div>
  );
}
