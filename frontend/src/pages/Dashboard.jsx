import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Dashboard1() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">

      {/* ---  ANIMATION--- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>

        <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <Navbar />

      {/* CONTENT */}
      <div className="relative z-10 p-10 max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-cyan-300 mb-10">
          SKIN DISEASES CLASSIFICATION
        </h1>

        {/* Stats Section */}
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

        {/* Upload Button */}
        <div className="text-center mb-14">
          <button className="px-12 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-xl font-bold shadow-lg hover:shadow-purple-600/50 hover:scale-110 transition-all">
            UPLOAD IMAGE
          </button>
        </div>

        {/* Recent Analysis */}
        <div className="bg-black bg-opacity-40 p-6 rounded-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-gray-200 mb-6">Recent Analysis</h2>

          <div className="space-y-4 text-gray-300">
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span>DermAI Input 01</span>
              <span className="text-green-300">Eczema (87%)</span>
              <span>Today</span>
            </div>

            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span>Analysis File 01</span>
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