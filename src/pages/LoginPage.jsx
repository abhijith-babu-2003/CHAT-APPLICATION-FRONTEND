import { useState } from "react";
import { userAuthStore } from "../store/userAuthStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { login, isLoggingIn } = userAuthStore();

  const validate = () => {
    const tempErrors = {};
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) tempErrors.email = "Invalid email format";

    if (!formData.password.trim()) tempErrors.password = "Password is required";
    else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(formData);
    } catch (err) {
      toast.error(err.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-900 text-gray-100">
      {/* Left Side - Form */}
      <div className="flex flex-1 justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-3xl font-bold text-white text-center">Welcome Back</h1>
          <p className="text-gray-400 text-center">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-300 font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2
                  ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-500"} 
                  bg-gray-700 text-white`}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-300 font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2
                  ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-blue-500"} 
                  bg-gray-700 text-white`}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Optional Image/Pattern */}
      <div className="hidden lg:flex flex-1 bg-gray-900 justify-center items-center">
        <div className="text-center px-8">
          <h2 className="text-4xl font-bold text-blue-400 mb-4">Welcome Back!</h2>
          <p className="text-blue-300">Sign in to access your dashboard and manage your tasks.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
