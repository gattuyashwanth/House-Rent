import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { IoShieldCheckmark, IoMail, IoLockClosed, IoEye, IoEyeOff } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const result = await loginAdmin(email, password);

    console.log("LOGIN RESULT:", result);

    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.error);
    }
  } catch (err) {
    setError(err.message);
  }

  setLoading(false);
};

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12">
        <div className="text-white max-w-md">
          <IoShieldCheckmark className="w-16 h-16 mb-6 opacity-80" />
          <h1 className="text-4xl font-bold mb-4">Flat Management Portal</h1>
          <p className="text-blue-100 text-lg">
            Resident Management System for apartment societies. Manage flats, residents, monthly bills in ₹, and society complaints.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-slide-up">
          <div className="glass-card">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center lg:hidden">
                <IoShieldCheckmark className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Society Admin Login</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Apartment Rental Management System</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                icon={IoMail}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rentease.in"
                required
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <div className="relative">
                  <IoLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>
              )}

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Sign In
              </Button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Demo: <strong>admin@rentease.in</strong> / <strong>admin123</strong>
            </p>
            <p className="text-center mt-2">
              <Link to="/" className="text-sm text-primary-600 hover:underline">Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
