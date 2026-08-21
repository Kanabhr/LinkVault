// import React, { useState, useId, memo } from "react";
// import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

// // --- Utility function for className merging ---
// function cn(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// // --- Liquid Glass Shadow Presets ---
// const GLASS_SHADOW_LIGHT = "shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)]";

// const GLASS_SHADOW_DARK = "dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]";

// const GLASS_SHADOW = `${GLASS_SHADOW_LIGHT} ${GLASS_SHADOW_DARK}`;

// const DEFAULT_GLASS_FILTER_SCALE = 30;
// const BUTTON_GLASS_FILTER_SCALE = 70;

// // --- SVG Glass Distortion Filter ---
// const GlassFilter = memo(({ id, scale = DEFAULT_GLASS_FILTER_SCALE }) => (
//   <svg aria-hidden="true" className="hidden" focusable={false}>
//     <defs>
//       <filter colorInterpolationFilters="sRGB" height="200%" id={id} width="200%" x="-50%" y="-50%">
//         <feTurbulence baseFrequency="0.05 0.05" numOctaves="1" result="turbulence" seed="1" type="fractalNoise" />
//         <feGaussianBlur in="turbulence" result="blurredNoise" stdDeviation="2" />
//         <feDisplacementMap in="SourceGraphic" in2="blurredNoise" result="displaced" scale={scale} xChannelSelector="R" yChannelSelector="B" />
//         <feGaussianBlur in="displaced" result="finalBlur" stdDeviation="4" />
//         <feComposite in="finalBlur" in2="finalBlur" operator="over" />
//       </filter>
//     </defs>
//   </svg>
// ));
// GlassFilter.displayName = "GlassFilter";

// // --- Liquid Glass Card Component ---
// export function LiquidGlassCard({ className = "", glassEffect = true, children, ...props }) {
//   const filterId = useId();

//   return (
//     <div className={cn("group relative overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/20 p-8 shadow-xl backdrop-blur-md dark:border-zinc-700/60 dark:bg-zinc-900/30", className)} {...props}>
//       <div className={cn("pointer-events-none absolute inset-0 rounded-[inherit]", GLASS_SHADOW)} />

//       {glassEffect && (
//         <>
//           <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]" style={{ backdropFilter: `url("#${filterId}")` }} />
//           <GlassFilter id={filterId} scale={DEFAULT_GLASS_FILTER_SCALE} />
//         </>
//       )}

//       <div className="relative z-10">{children}</div>

//       <div className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 dark:via-white/5" />
//     </div>
//   );
// }

// // --- Liquid Glass Button Component ---
// export function LiquidButton({ children, className = "", type = "button", onClick, disabled = false, ...props }) {
//   const filterId = useId();

//   return (
//     <>
//       <button type={type} onClick={onClick} disabled={disabled} className={cn("relative flex items-center justify-center gap-2 overflow-hidden rounded-xl font-medium transition-all duration-200 active:scale-[0.98] hover:scale-[1.02] disabled:pointer-events-none disabled:opacity-50", className)} {...props}>
//         <div className={cn("pointer-events-none absolute inset-0 rounded-[inherit]", GLASS_SHADOW)} />
//         <div className="pointer-events-none absolute inset-0 isolate -z-10 overflow-hidden rounded-[inherit]" style={{ backdropFilter: `url("#${filterId}")` }} />
//         <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
//       </button>
//       <GlassFilter id={filterId} scale={BUTTON_GLASS_FILTER_SCALE} />
//     </>
//   );
// }

// // --- Liquid Glass Input Component ---
// function LiquidInput({ icon: Icon, rightElement, className = "", ...props }) {
//   return (
//     <div className="relative flex items-center">
//       {Icon && <Icon className="absolute left-3.5 size-4 text-zinc-500 dark:text-zinc-400" />}
//       <input className={cn("w-full rounded-xl border border-zinc-200/80 bg-white/40 px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 backdrop-blur-sm transition-all focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/20 dark:border-zinc-700/80 dark:bg-zinc-950/40 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500", Icon && "pl-10", rightElement && "pr-10", className)} {...props} />
//       {rightElement && <div className="absolute right-3 flex items-center">{rightElement}</div>}
//     </div>
//   );
// }

// // --- Main Register User Form ---
// export default function RegisterForm() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     terms: false,
//   });
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSubmitted(true);
//     setTimeout(() => {
//       alert(JSON.stringify(formData, null, 2));
//       setIsSubmitted(false);
//     }, 1200);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-zinc-100 to-rose-100 p-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
//       <LiquidGlassCard className="w-full max-w-md">
//         {/* Card Header */}
//         <div className="mb-6 text-center">
//           <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-zinc-900/5 shadow-inner dark:bg-white/5">
//             <Sparkles className="size-6 text-zinc-700 dark:text-zinc-200" />
//           </div>
//           <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Create an Account</h2>
//           <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Join us today and enjoy the liquid glass experience</p>
//         </div>

//         {/* Registration Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Full Name</label>
//             <LiquidInput required type="text" name="name" placeholder="Jane Doe" icon={User} value={formData.name} onChange={handleChange} />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Email Address</label>
//             <LiquidInput required type="email" name="email" placeholder="jane@example.com" icon={Mail} value={formData.email} onChange={handleChange} />
//           </div>

//           <div className="space-y-1.5">
//             <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">Password</label>
//             <LiquidInput
//               required
//               type={showPassword ? "text" : "password"}
//               name="password"
//               placeholder="••••••••••••"
//               icon={Lock}
//               value={formData.password}
//               onChange={handleChange}
//               rightElement={
//                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-zinc-400 transition hover:text-zinc-600 dark:hover:text-zinc-200">
//                   {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
//                 </button>
//               }
//             />
//           </div>

//           {/* Terms and conditions checkbox */}
//           <div className="flex items-center gap-2 pt-1">
//             <input type="checkbox" id="terms" name="terms" required checked={formData.terms} onChange={handleChange} className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800" />
//             <label htmlFor="terms" className="text-xs text-zinc-600 dark:text-zinc-400">
//               I agree to the{" "}
//               <a href="#terms" className="underline hover:text-zinc-900 dark:hover:text-zinc-200">
//                 Terms of Service
//               </a>{" "}
//               and{" "}
//               <a href="#privacy" className="underline hover:text-zinc-900 dark:hover:text-zinc-200">
//                 Privacy Policy
//               </a>
//             </label>
//           </div>

//           {/* Submit Button */}
//           <LiquidButton type="submit" disabled={isSubmitted} className="mt-2 w-full bg-zinc-900/90 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-900 dark:bg-white/90 dark:text-zinc-950 dark:hover:bg-white">
//             {isSubmitted ? (
//               <>
//                 <CheckCircle2 className="size-4 animate-spin" />
//                 Creating account...
//               </>
//             ) : (
//               <>
//                 <UserPlus className="size-4" />
//                 Register Now
//                 <ArrowRight className="size-4" />
//               </>
//             )}
//           </LiquidButton>
//         </form>

//         {/* Footer */}
//         <p className="mt-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
//           Already have an account?{" "}
//           <a href="#login" className="font-medium text-zinc-800 underline underline-offset-4 transition hover:text-zinc-950 dark:text-zinc-200 dark:hover:text-white">
//             Sign in
//           </a>
//         </p>
//       </LiquidGlassCard>
//     </div>
//   );
// }
