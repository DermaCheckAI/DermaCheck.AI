import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Analysis() {

  const navigate = useNavigate(); // FIX

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [cameraOn, setCameraOn] = useState(false);
  const [analysisDone, setAnalysisDone] = useState(false);

  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    console.log("Running in DEMO mode");
  }, []);

  const handleUpload = async () => {
    if (!image) {
      setMessage("❌ Please select or capture an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      setMessage("Uploading image...");
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setPrediction(data.prediction || "-");
        setConfidence(data.confidence || 0);

        setSymptoms(
          data.symptoms ||
          data.details?.symptoms ||
          "No symptoms provided"
        );

        setAdvice(
          data.advice ||
          data.details?.advice ||
          "No advice available"
        );

        setMessage("");
      } else {
        setMessage("Error: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to connect to backend");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <Navbar />

      <div className="relative z-10 p-10 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-cyan-300 mb-10">
          SKIN DISEASES CLASSIFICATION
        </h1>

        <div className="text-center mt-10 bg-gray-800 bg-opacity-40 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-yellow-300 mb-6">
            Upload Image for Detection
          </h2>

          <label className="bg-yellow-400 text-black px-4 py-2 rounded cursor-pointer font-semibold">
            Choose File
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                setImage(e.target.files[0]);
                setPreview(URL.createObjectURL(e.target.files[0]));
                setAnalysisDone(false);
                setMessage("");
              }}
            />
          </label>

          <p className="text-gray-400 mt-2">
            {image ? image.name : "No file chosen"}
          </p>

          <div className="mt-4">
            <button
              onClick={() => setCameraOn(!cameraOn)}
              className="bg-cyan-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transition"
            >
              {cameraOn ? "Close Camera" : "Open Camera"}
            </button>
          </div>

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

          <button
            onClick={handleUpload}
            className="mt-6 px-12 py-3 rounded-full 
                       bg-gradient-to-r from-cyan-500 to-purple-600
                       text-white text-xl font-bold
                       hover:scale-105 transition-all shadow-lg"
          >
            Analysis
          </button>

          {message && <p className="text-green-400 mt-4">{message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-12 mt-16 mb-11">
          <div className="flex-1 max-w-md w-full bg-black bg-opacity-50 border border-green-500 rounded-xl p-8 text-center shadow-xl hover:scale-105 transition">
            <h2 className="text-gray-300 text-xl">Confidence Score</h2>
            <p className="text-lg font-bold text-green-400 mt-3">
              {confidence ? `${confidence}%` : "0%"}
            </p>
          </div>

          <div className="w-full bg-black bg-opacity-50 border border-pink-500 rounded-xl p-8 text-center shadow-xl hover:scale-105 transition">
            <h2 className="text-gray-300 text-xl">Diseases classified</h2>
            <p className="text-lg font-bold text-pink-400 mt-3">
              {prediction || "-"}
            </p>
          </div>
        </div>

        <div className="w-full bg-black bg-opacity-50 border border-blue-500 rounded-xl p-8 text-center shadow-xl hover:scale-105 transition">
          <h2 className="text-gray-300 text-xl">Symptoms</h2>
          <p className="text-lg font-semibold mt-3 text-cyan-300">
            {symptoms || "-"}
          </p>
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={() =>
              navigate("/suggestions", {
                state: { disease: "Acne" },
              })
            }
            className="px-14 py-4 rounded-full bg-gradient-to-r from-green-400 to-cyan-500 text-black text-xl font-bold hover:scale-110 transition-all shadow-xl"
          >
            🩺 Care Guidance
          </button>
        </div>

        {/* <div className="w-full bg-black bg-opacity-50 border border-yellow-500 rounded-xl p-8 text-center shadow-xl hover:scale-105 transition">
          <h2 className="text-gray-300 text-xl">Advice</h2>
          <p className="text-lg font-semibold mt-3 text-yellow-300">
            {advice || "-"}
          </p>
        </div> */}

        <div className="mt-10 w-full bg-black bg-opacity-50 border border-yellow-500 rounded-xl p-8 text-center shadow-xl hover:scale-105 transition">
  <h2 className="text-gray-300 text-xl">Advice</h2>
  <p className="text-lg font-semibold mt-3 text-yellow-300">
    {advice || "-"}
  </p>
</div>
      </div>

      <Footer />
    </div>
  );
}