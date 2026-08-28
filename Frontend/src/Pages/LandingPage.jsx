import { Link } from "react-router-dom"

export default function LandingPage() {
  return (
    <div>

      {/* Navbar */}
      <nav>
        <span>BMS</span>
        <div>
          <Link to="/login">Login</Link>
          <Link to="/register">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section>
        <h1>Save Links. Organize. Share.</h1>
        <p>
          BMS lets you save, categorize, and share your bookmark collection.
          Paste multiple URLs at once, tag them, and access them from anywhere.
        </p>
        <div>
          <Link to="/register">Start for free</Link>
          <Link to="/login">Sign in</Link>
        </div>
      </section>

      {/* Mock preview */}
      <section>
        <p>My Bookmarks</p>
        {[
          { initials: "GH", name: "GitHub", url: "github.com", cat: "Knowledge" },
          { initials: "YT", name: "YouTube", url: "youtube.com", cat: "Entertainment" },
          { initials: "No", name: "Notion", url: "notion.so", cat: "Personal" },
          { initials: "Fi", name: "Figma", url: "figma.com", cat: "Knowledge" },
        ].map(item => (
          <div key={item.name}>
            <span>{item.initials}</span>
            <div>
              <p>{item.name}</p>
              <p>{item.url}</p>
            </div>
            <span>{item.cat}</span>
          </div>
        ))}
      </section>

      {/* Features */}
      <section>
        <h2>Everything you need</h2>
        <p>Built for people who save a lot of links and actually want to find them later.</p>
        <div>
          <div>
            <h3>Bulk Save</h3>
            <p>Paste multiple URLs at once — separated by newline, space, or comma.</p>
          </div>
          <div>
            <h3>Smart Categories</h3>
            <p>Organize with 4 preset categories or create your own custom tags.</p>
          </div>
          <div>
            <h3>Public Profiles</h3>
            <p>Share your entire bookmark collection with a public link.</p>
          </div>
          <div>
            <h3>Custom Tags</h3>
            <p>Create unlimited custom tags to organize links exactly the way you think.</p>
          </div>
          <div>
            <h3>Quick Access</h3>
            <p>Search, filter, and open any saved link directly from your profile.</p>
          </div>
          <div>
            <h3>Bulk Import — Coming Soon</h3>
            <p>Import from YouTube, Chrome bookmarks with auto-categorization.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <h2>Ready to organize your links?</h2>
        <p>Free to use. No credit card required.</p>
        <Link to="/register">Create your account</Link>
      </section>

      {/* Footer */}
      <footer>
        <p>BMS — Bookmark Manager © 2026</p>
      </footer>

    </div>
  )
}
