import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { Lock, User, CheckCircle, AlertTriangle } from "lucide-react";

export default function Settings() {
  
  // --- STATE FOR CHANGE PASSWORD FORM ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // --- FEEDBACK STATE ---
  const [status, setStatus] = useState({ 
    message: '', 
    type: '' 
  });
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // 🌟 SUBSCRIPTION STATES
  // -----------------------------
  const [subscription, setSubscription] = useState(null);
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [subLoading, setSubLoading] = useState(false);

  // Fetch subscription status (FIXED)
  const fetchSubscription = async () => {
    try {
      const res = await axiosClient.get("users/subscription/");
      setSubscription(res.data);
    } catch (error) {
      setSubscription(null);
    }
  };

  // Fetch all plans (FIXED)
  const fetchPlans = async () => {
    try {
      const res = await axiosClient.get("users/plans/");
      setPlans(res.data);
    } catch (error) {
      console.log("Plan fetch error");
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  // Buy Plan (FIXED)
  const handleBuyPlan = async (planId) => {
    setSubLoading(true);
    try {
      await axiosClient.post("users/subscribe/", { plan_id: planId });
      await fetchSubscription();  // refresh subscription
      setShowModal(false);
    } catch (error) {
      alert("Error buying plan");
    }
    setSubLoading(false);
  };

  // -----------------------------
  // CHANGE PASSWORD
  // -----------------------------
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setStatus({ message: '', type: '' });
    setLoading(true);

    if (newPassword.length < 6) {
      setStatus({ message: "New password must be at least 6 characters.", type: 'error' });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ message: "New passwords do not match.", type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const response = await axiosClient.post("users/change-password/", {
        old_password: oldPassword, 
        new_password: newPassword,
      });

      setStatus({ message: "Password updated successfully! 🎉", type: 'success' });

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      const errorMsg = error.response?.data?.detail || 
                       error.response?.data?.message || 
                       "Error: Could not update password.";

      setStatus({ message: errorMsg, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen w-full bg-[#121316] text-white px-4 sm:px-6">

      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-4xl font-extrabold mb-10">
            Account Settings
        </h1>

        {/* --- ACCOUNT MANAGEMENT SECTION --- */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2 flex items-center gap-3">
                <User className="w-6 h-6 text-red-500" /> Account Details
            </h2>
            
            <div className="bg-neutral-800/50 p-6 rounded-lg">
                <p className="text-gray-300">
                    Your current plan:{" "}
                    <span className="font-semibold text-red-500">
                        {subscription?.plan || "No Plan"}
                    </span>
                </p>

                <p className="text-gray-300 mt-2">
                    Subscription Status:{" "}
                    <span className={subscription?.status === "active" ? "text-green-400" : "text-red-400"}>
                        {subscription?.status === "active" ? "Active" : "Inactive"}
                    </span>
                </p>

                {subscription?.expires && (
                  <p className="text-gray-300 mt-2">
                    Expires on:{" "}
                    <span className="text-yellow-400">
                      {new Date(subscription.expires).toDateString()}
                    </span>
                  </p>
                )}

                <button
                    onClick={() => {
                      setShowModal(true);
                      fetchPlans();
                    }}
                    className="mt-4 px-4 py-2 text-sm bg-red-600 rounded hover:bg-red-700 transition"
                >
                    Manage Subscription
                </button>
            </div>
        </section>


        {/* ----------------------------- */}
        {/* 🌟 SUBSCRIPTION PLANS MODAL */}
        {/* ----------------------------- */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-neutral-900 p-6 rounded-lg w-80">
              <h2 className="text-xl font-bold mb-4">Choose a Plan</h2>

              {plans.map(plan => (
                <div 
                  key={plan.id} 
                  className="border border-gray-700 p-3 rounded-lg mb-3"
                >
                  <p className="text-lg font-semibold">{plan.name}</p>
                  <p className="text-red-400 mt-1">₹ {plan.price}</p>
                  <p className="text-gray-400 text-sm">{plan.duration} days</p>

                  <button
                    disabled={subLoading}
                    onClick={() => handleBuyPlan(plan.id)}
                    className="mt-3 w-full bg-red-600 py-2 rounded hover:bg-red-700 disabled:bg-gray-600"
                  >
                    {subLoading ? "Processing..." : "Buy"}
                  </button>
                </div>
              ))}

              <button 
                onClick={() => setShowModal(false)}
                className="mt-2 w-full bg-gray-700 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}


        {/* --- SECURITY & PASSWORD SECTION --- */}
        <section>
            <h2 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2 flex items-center gap-3">
                <Lock className="w-6 h-6 text-red-500" /> Security
            </h2>
            
            <div className="bg-neutral-800/50 p-6 rounded-lg max-w-lg">
                <h3 className="text-xl font-semibold mb-4">Change Password</h3>

                {status.message && (
                    <div 
                        className={`p-3 rounded-lg mb-4 flex items-center gap-2 ${
                            status.type === 'success' 
                                ? 'bg-green-900/50 text-green-400 border border-green-700' 
                                : 'bg-red-900/50 text-red-400 border border-red-700'
                        }`}
                    >
                        {status.type === 'success' ? <CheckCircle className="w-5 h-5"/> : <AlertTriangle className="w-5 h-5"/>}
                        <p className="text-sm font-medium">{status.message}</p>
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                    
                    <input
                        type="password"
                        placeholder="Current Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="px-4 py-3 rounded-lg bg-black text-white border border-gray-700 outline-none focus:border-red-500 transition"
                    />

                    <input
                        type="password"
                        placeholder="New Password (min. 6 chars)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="px-4 py-3 rounded-lg bg-black text-white border border-gray-700 outline-none focus:border-red-500 transition"
                    />
                    
                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="px-4 py-3 rounded-lg bg-black text-white border border-gray-700 outline-none focus:border-red-500 transition"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-3 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition disabled:bg-gray-600"
                    >
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </form>

            </div>
        </section>

      </div>
    </div>
  );
}
