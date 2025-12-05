import { useNavigate } from "react-router-dom";

export default function CTAFooter() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-gray-900 to-black py-16 mt-20 rounded-xl shadow-2xl border border-gray-800/50">
      <div className="max-w-4xl mx-auto text-center px-6">

        {/* Title updated for better contrast */}
        <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Ready to Watch Premium Movies?
        </h2>

        {/* Paragraph text subdued slightly for dark theme */}
        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
          Subscribe now and get unlimited access to our full premium library, exclusive releases, and 4K content.
        </p>

        {/* Button switched to white background with dark theme effects */}
        <button
          onClick={() => navigate("/settings")}
          className="px-10 py-4 bg-white text-gray-900 font-extrabold rounded-xl text-lg 
                     hover:bg-gray-200 transition-all duration-300 shadow-lg shadow-gray-700/50 
                     transform hover:scale-[1.03] active:scale-95 ring-2 ring-gray-600/50"
        >
          Subscribe Now
        </button>

      </div>
    </div>
  );
}