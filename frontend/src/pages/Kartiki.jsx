import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Kartiki() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">

      {/* Navbar */}
      <Navbar />

      {/* Background Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-8 right-10 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

        <svg className="absolute inset-0 w-full h-full opacity-5" preserveAspectRatio="none">
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path 
              d="M 50 0 L 0 0 0 50" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5" 
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Page Content */}
      <div className="p-8 text-center relative z-10">
        <h1 className="text-3xl font-bold text-blue-400">Kartiki Page</h1>
        <p className="text-gray-300 mt-4">
          This is a simple practice page created for Kartiki 😊
        </p>
      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}