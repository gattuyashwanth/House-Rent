import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { IoLockClosed, IoBedOutline, IoEye, IoEyeOff } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function TenantLoginPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { loginTenant } = useAuth();
  const { rooms } = useApp();

  const room = rooms.find((r) => r.id === roomId);
  const [roomNumber, setRoomNumber] = useState(room?.roomNumber || "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
     
      const result = await loginTenant(roomNumber, password, room?.apartmentId);
      if (result.success) {
        if (remember) 
          localStorage.setItem("rentease-remember", roomNumber);
        navigate("/tenant/dashboard");
      } else {
        setError(result.error);
      }
      setLoading(false);
    
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="glass-card">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-bg flex items-center justify-center">
              <IoLockClosed className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resident Login</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {room ? `Flat No. ${room.roomNumber}` : "Enter your flat credentials"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Flat Number"
              icon={IoBedOutline}
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. 101, 202, 303"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <IoEyeOff className="w-5 h-5" /> : <IoEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Remember Me</span>
            </label>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{error}</p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            Demo: Flat <strong>101</strong> / Password <strong>tenant123</strong> (Ravi Kumar)
          </p>
          <p className="text-center mt-2">
            <Link to="/" className="text-sm text-primary-600 hover:underline">Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
