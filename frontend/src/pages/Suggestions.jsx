import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Suggestions() {
  const doctors = [
    {
      name: "Dr. Anjali Patil",
      specialization: "Dermatologist",
      hospital: "City Skin Care Clinic",
      phone: "+91 98765 43210",
    },
    {
      name: "Dr. Rahul Deshmukh",
      specialization: "Skin & Hair Specialist",
      hospital: "DermaLife Hospital",
      phone: "+91 91234 56789",
    },
    {
      name: "Dr. Sneha Kulkarni",
      specialization: "Cosmetic Dermatologist",
      hospital: "Glow Skin Center",
      phone: "+91 99887 66554",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">

      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-10 flex-1 py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Doctor Suggestions
        </h2>

        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doc, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-cyan-400/30 rounded-2xl shadow-xl shadow-cyan-500/20 p-6 hover:scale-105 transition-transform"
            >
              <h3 className="text-xl font-bold text-cyan-400 mb-2">
                {doc.name}
              </h3>

              <p className="text-gray-300 mb-1">
                <span className="text-gray-400">Specialization:</span>{" "}
                {doc.specialization}
              </p>

              <p className="text-gray-300 mb-3">
                <span className="text-gray-400">Hospital:</span>{" "}
                {doc.hospital}
              </p>

              <a
                href={`tel:${doc.phone}`}
                className="inline-block mt-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                📞 {doc.phone}
              </a>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
