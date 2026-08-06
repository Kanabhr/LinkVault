import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [password, setPassword] = useState("");

  // Password strength indicator
  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["bg-gray-200", "bg-red-400", "bg-yellow-400", "bg-blue-400", "bg-green-500"];
  const strength = getStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-800 via-teal-600 to-slate-700 px-4">
      <div className="bg-slate-100 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-teal-600 rounded-2xl p-3">
            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        {/* <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">Create Account</h1> */}
        <p className="text-sm text-center text-gray-500 mb-6">Join us today — it's completely free</p>

        <form className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Email Address</label>
            <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm pr-10" />
              {/* Show/hide toggle */}
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a9.95 9.95 0 016.36 2.275M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Strength bar */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColors[strength] : "bg-gray-200"}`} />
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-right mt-1">{strengthLabels[strength]}</p>
              </div>
            )}
          </div>

          {/* Terms checkbox */}
          <div className="flex items-center gap-2">
            <input id="terms" type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="w-4 h-4 accent-teal-600 rounded" />
            <label htmlFor="terms" className="text-xs text-gray-600">
              I agree to the{" "}
              <a href="#" className="text-teal-600 font-semibold hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-teal-600 font-semibold hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          {/* Submit button — wire up onSubmit yourself */}
          <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
