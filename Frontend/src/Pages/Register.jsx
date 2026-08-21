import { useState } from "react";

export default function Register() {
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
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-teal-800 via-teal-600 to-slate-700 px-4 py-8">
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
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Full Name</label>
            <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
          </div>

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

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Google button */}
        <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-3 rounded-xl transition-colors duration-200 text-sm shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        {/* Sign in link */}
        <p className="text-center text-xs text-gray-500 mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-teal-600 font-semibold hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
