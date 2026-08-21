import { useState } from "react";

// Static placeholder data — replace with real API data when implementing logic
const PRESET_CATEGORIES = ["Tech", "Design", "Finance", "Health", "Science", "Travel"];

const SAMPLE_LINKS = [
  {
    id: 1,
    title: "The Future of AI in 2025",
    url: "openai.com/blog/future",
    category: "Tech",
    time: "2 min ago",
  },
];

const STATS = {
  totalLinks: 24,
  categories: 6,
  thisWeek: 7,
};

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("Tech");
  const [activeNav, setActiveNav] = useState("Home");
  const [activeStatCard, setActiveStatCard] = useState("Categories");

  return (
    <div className="flex h-screen bg-[#0b2b26] text-white overflow-hidden">
      {/* ── Sidebar ── */}
      <aside className="flex flex-col items-center w-16 py-6 bg-[#0d3028] border-r border-white/5 shrink-0">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7H7a5 5 0 000 10h10a5 5 0 000-10zm0 8H7a3 3 0 010-6h10a3 3 0 010 6z" />
            </svg>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col items-center gap-6 flex-1">
          {[
            {
              label: "Home",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7m-9 2v6m0 0h4m-4 0H7" />,
            },
            {
              label: "Categories",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
            },
            {
              label: "Settings",
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
            },
          ].map(({ label, icon }) => (
            <button key={label} onClick={() => setActiveNav(label)} className={`flex flex-col items-center gap-1 group`}>
              <div className={`p-2 rounded-xl transition-colors ${activeNav === label ? "bg-teal-700" : "hover:bg-white/10"}`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {icon}
                </svg>
              </div>
              <span className="text-[9px] text-gray-400">{label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button onClick={() => setActiveNav("Logout")} className="flex flex-col items-center gap-1 mt-auto group">
          <div className="p-2 rounded-xl hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
          </div>
          <span className="text-[9px] text-gray-400">Logout</span>
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 pt-6 pb-2 shrink-0">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Dashboard</p>
            <h1 className="text-2xl font-bold text-white">My Saved Links</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-sm text-gray-200">Alex Morgan</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center font-bold text-white text-sm">A</div>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-4">
          {/* Save link card */}
          <div className="bg-[#0f3d34] rounded-2xl p-5 border border-white/5">
            {/* URL input + Save button */}
            <div className="flex gap-3 mb-5">
              <div className="flex items-center flex-1 bg-white/90 rounded-xl px-4 gap-2">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <input type="url" placeholder="Paste link to save..." className="flex-1 py-3 bg-transparent text-gray-700 placeholder-gray-400 focus:outline-none text-sm" />
              </div>
              {/* Wire up onClick when implementing logic */}
              <button className="flex items-center gap-2 bg-[#0f3d34] border border-white/20 hover:bg-white/10 text-white px-5 py-3 rounded-xl text-sm font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save
              </button>
            </div>

            {/* Categories */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 uppercase tracking-widest">Categories</span>
              {/* Wire up onClick when implementing custom category logic */}
              <button className="flex items-center gap-1 text-xs text-gray-300 border border-white/20 rounded-full px-3 py-1 hover:bg-white/10 transition-colors">
                <span className="text-base leading-none">+</span> Custom Category
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {PRESET_CATEGORIES.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedCategory === cat ? "bg-white text-gray-900 border-white" : "bg-transparent text-gray-300 border-white/20 hover:bg-white/10"}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Saves */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-white">Recent Saves</h2>
              <span className="text-xs text-gray-400 border border-white/10 rounded-full px-3 py-0.5">
                {SAMPLE_LINKS.length} link{SAMPLE_LINKS.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {SAMPLE_LINKS.map((link) => (
                <div key={link.id} className="flex items-center gap-4 bg-[#0f3d34]/60 border border-white/5 rounded-xl px-4 py-3">
                  {/* Favicon placeholder */}
                  <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-sm">{link.title.charAt(0)}</span>
                  </div>

                  {/* Title + URL */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{link.title}</p>
                    <p className="text-xs text-gray-400 truncate">{link.url}</p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-gray-300 border border-white/15 rounded-full px-3 py-0.5">{link.category}</span>
                    <span className="text-xs text-gray-500">{link.time}</span>
                    {/* External link — wire up href when implementing logic */}
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <footer className="grid grid-cols-3 gap-3 px-8 py-4 shrink-0">
          {[
            {
              label: "Total Links",
              value: STATS.totalLinks,
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />,
              iconColor: "text-teal-400",
              iconBg: "bg-teal-900/50",
            },
            {
              label: "Categories",
              value: STATS.categories,
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
              iconColor: "text-blue-400",
              iconBg: "bg-blue-900/50",
            },
            {
              label: "This Week",
              value: STATS.thisWeek,
              icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
              iconColor: "text-yellow-400",
              iconBg: "bg-yellow-900/40",
            },
          ].map(({ label, value, icon, iconColor, iconBg }) => (
            <button key={label} onClick={() => setActiveStatCard(label)} className={`flex items-center gap-4 rounded-2xl px-5 py-4 border transition-all ${activeStatCard === label ? "border-blue-500 bg-[#0f3d34]" : "border-white/5 bg-[#0f3d34]/40 hover:bg-[#0f3d34]/70"}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                <svg className={`w-5 h-5 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {icon}
                </svg>
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-white">{value}</p>
                <p className="text-xs text-gray-400">{label}</p>
              </div>
            </button>
          ))}
        </footer>
      </main>
    </div>
  );
}
