export default function LoginModal({ open, onClose, onLogin }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">

      {/* Background */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Glass Modal */}
      <div className="
        relative bg-white/10 backdrop-blur-xl p-8 rounded-2xl 
        border border-white/20 shadow-xl text-center max-w-sm w-[90%]
      ">
        <h2 className="text-2xl font-bold text-white mb-2">🔒 Login Required</h2>
        <p className="text-gray-300 text-sm mb-6">
          Please login to continue.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={onLogin}
            className="px-6 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            Login
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
