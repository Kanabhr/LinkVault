import { motion } from "motion/react"
import { Link } from "react-router-dom"
import { Bookmark, Tag, Globe, ArrowRight, BookMarked, Layers } from "lucide-react"
import { cn } from "../lib/utils"

// ── Liquid Glass card component ───────────────────────────────────────────────
function GlassCard({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-xl",
        "ring-1 ring-white/10",
        className
      )}
    >
      {children}
    </div>
  )
}

// ── Feature card ──────────────────────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <GlassCard className="p-6 h-full hover:bg-white/15 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-400/30">
            <Icon className="w-5 h-5 text-teal-300" />
          </div>
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-white/60 text-sm leading-relaxed">{description}</p>
      </GlassCard>
    </motion.div>
  )
}

// ── Main LandingPage ──────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#0b2b26] overflow-x-hidden">

      {/* ── Animated background blobs ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-teal-500/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[100px] animate-pulse delay-1000" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[80px] animate-pulse delay-2000" />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-teal-500/20 border border-teal-400/30">
            <BookMarked className="w-5 h-5 text-teal-300" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">BMS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-white/70 hover:text-white text-sm font-medium transition-colors px-4 py-2"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-teal-500 hover:bg-teal-400 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 md:pt-32">

        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="inline-flex items-center gap-2 px-4 py-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-teal-300 text-sm font-medium">Your personal bookmark manager</span>
          </GlassCard>
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-4xl"
        >
          Save Links.
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
            {" "}Organize.{" "}
          </span>
          Share.
        </motion.h1>

        {/* subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed"
        >
          BMS lets you save, categorize, and share your bookmark collection.
          Paste multiple URLs at once, tag them, and access them from anywhere.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/register"
            className="flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
          >
            Start for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="text-white/70 hover:text-white font-medium px-8 py-3 rounded-xl border border-white/10 hover:border-white/30 transition-all duration-200"
          >
            Sign in
          </Link>
        </motion.div>

      </section>

      {/* ── Liquid Glass Preview Card ── */}
      <section className="relative z-10 flex justify-center px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="w-full max-w-3xl"
        >
          <GlassCard className="p-6 md:p-8">

            {/* mock header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-green-400/70" />
              </div>
              <span className="text-white/40 text-xs">My Bookmarks</span>
              <div className="w-16" />
            </div>

            {/* mock bookmark rows */}
            {[
              { initials: "GH", name: "GitHub", url: "github.com", cat: "Knowledge" },
              { initials: "YT", name: "YouTube", url: "youtube.com", cat: "Entertainment" },
              { initials: "No", name: "Notion", url: "notion.so", cat: "Personal" },
              { initials: "Fi", name: "Figma", url: "figma.com", cat: "Knowledge" },
            ].map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 transition-colors duration-200 mb-2"
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 font-bold text-sm flex-shrink-0">
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{item.name}</p>
                  <p className="text-white/40 text-xs truncate">{item.url}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-400/20 flex-shrink-0">
                  {item.cat}
                </span>
              </motion.div>
            ))}

          </GlassCard>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative z-10 px-6 pb-24 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Built for people who save a lot of links and actually want to find them later.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <FeatureCard
            icon={Bookmark}
            title="Bulk Save"
            description="Paste multiple URLs at once — separated by newline, space, or comma. Save your entire reading list in seconds."
            delay={0}
          />
          <FeatureCard
            icon={Layers}
            title="Smart Categories"
            description="Organize with 4 preset categories — Personal, Entertainment, Knowledge, Instagram — or create your own custom tags."
            delay={0.1}
          />
          <FeatureCard
            icon={Globe}
            title="Public Profiles"
            description="Share your entire bookmark collection with a public link. Your profile at /u/username is accessible to anyone."
            delay={0.2}
          />
          <FeatureCard
            icon={Tag}
            title="Custom Tags"
            description="Create unlimited custom tags to organize links exactly the way you think. Tags live alongside preset categories."
            delay={0.3}
          />
          <FeatureCard
            icon={BookMarked}
            title="Quick Access"
            description="Search, filter, and open any saved link directly from your profile. No more lost bookmarks."
            delay={0.4}
          />
          <FeatureCard
            icon={ArrowRight}
            title="Coming Soon"
            description="Import from YouTube, Chrome bookmarks, and more. Bulk import with auto-categorization using hashtag analysis."
            delay={0.5}
          />
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative z-10 px-6 pb-24 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full max-w-2xl"
        >
          <GlassCard className="p-10 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to organize your links?
            </h2>
            <p className="text-white/50 mb-8">
              Free to use. No credit card required.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold px-10 py-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-teal-500/25"
            >
              Create your account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 text-center py-8 text-white/30 text-sm border-t border-white/5">
        BMS — Bookmark Manager © 2026
      </footer>

    </div>
  )
}
