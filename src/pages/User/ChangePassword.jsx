export default function ChangePassword() {
    return (
      <div className="pt-24 px-6 pb-12 flex justify-center text-white">
  
        <div className="w-full max-w-md bg-[#111] p-8 rounded-xl shadow-xl border border-gray-800">
  
          <h1 className="text-2xl font-bold mb-6 text-center">
            🔐 Change Password
          </h1>
  
          <form className="flex flex-col gap-5">
  
            {/* Current Password */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className="px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700
                outline-none focus:border-red-500 transition"
              />
            </div>
  
            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700
                outline-none focus:border-red-500 transition"
              />
            </div>
  
            {/* Confirm New Password */}
            <div className="flex flex-col gap-2">
              <label className="text-gray-300 text-sm">Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                className="px-4 py-3 rounded-lg bg-gray-900 text-white border border-gray-700
                outline-none focus:border-red-500 transition"
              />
            </div>
  
            {/* Button */}
            <button
              className="mt-3 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg 
              transition-all shadow-lg"
            >
              Update Password
            </button>
  
          </form>
        </div>
      </div>
    );
  }
  