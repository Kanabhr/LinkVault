# BMS — Bookmark Manager App

A full-stack bookmark manager built with React, Node.js, Express, and MongoDB. Save, organize, and manage your links across custom and preset categories.

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcrypt

---

## Features

### Completed
- User registration with duplicate check and password hashing
- User login with password verification
- Input validation utilities
- REST API structure with versioned routes (`/api/v1/`)
- Mongoose schemas for users, saved links, and custom categories
- Register and Login UI
- Dashboard UI for saving and viewing links

### In Progress
- JWT token generation and auth middleware
- Save / edit / delete link functionality
- Frontend routing between pages
- Dashboard connected to live API data
- Logout

---

## Project Structure

```
BMS-APP/
├── Backend/
│   ├── Controllers/
│   │   ├── User.controller.js       # Register, Login, UserProfile
│   │   └── Linkdata.controller.js   # SaveLinks, EditLinksandTag
│   ├── Routes/
│   │   ├── User.routes.js
│   │   └── Linkdata.routes.js
│   ├── MongoDB/
│   │   ├── Models/
│   │   │   ├── UserSchema.js
│   │   │   └── Urlschema.js
│   │   └── Connection.js
│   ├── Utils/
│   │   ├── AsyncHandler.js
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── Validation.js
│   ├── app.js
│   └── server.js
│
└── Frontend/
    └── BMS/
        ├── src/
        │   ├── App.jsx
        │   ├── Dashboard.jsx
        │   └── index.css
        └── Auth/
            ├── Register.jsx
            └── Login.jsx
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/register` | Register a new user |
| POST | `/api/v1/users/login` | Login existing user |
| GET | `/api/v1/users/userprofile` | Get user profile |
| POST | `/api/v1/Linkdata/Mainpage` | Save a new link |
| PATCH | `/api/v1/Linkdata/Editpage` | Edit a link or tag |

---

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account

### Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` folder:

```
MONGODB_URI=your_mongodb_connection_string
PORT=3000
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=10d
```

Start the server:

```bash
node server.js
```

### Frontend Setup

```bash
cd Frontend/BMS
npm install
npm run dev
```

---

## Status

This project is actively under development. Core authentication is functional. Link management and frontend routing are currently being implemented.
## Bulk import feature 
Feature Plan: Universal Bulk Bookmark Import System
1. Executive Summary
Objective: To reduce user friction by allowing users to import multiple saved bookmarks (URLs, posts, videos) simultaneously from third-party platforms (e.g., X, Instagram, TikTok, Reddit, web browsers) into our application.
Challenge: Platforms have varying levels of openness. Some provide robust APIs, while others actively block third-party access to private user data (like saved folders).
Solution: Implement a multi-strategy import system utilizing OAuth APIs, Data Export Parsing, and Browser Extensions.
2. Platform Categorization & Import Strategies
To support the maximum number of platforms, the system will use three distinct technical strategies.
Strategy A: OAuth 2.0 & Official APIs (The "Open" Platforms)
Target Platforms: X (Twitter), Reddit, YouTube, GitHub, Pinterest.
Mechanism: Standard OAuth 2.0 Authorization Code flow.
Flow:
User clicks "Connect [Platform]".
User authorizes our app.
Our backend receives an Access Token.
Backend queries the platform's native "Saved/Bookmarks" endpoint.
Discussion Points: How do we securely store access tokens? How do we handle API rate limits during massive bulk imports?
Strategy B: Data Export Parsing (The "Closed" Platforms)
Target Platforms: Instagram, TikTok, Facebook, Browser Bookmarks (HTML).
Mechanism: File I/O and JSON/HTML Deserialization.
Flow:
User requests a data export (.zip containing .json or .html) from the target platform (GDPR compliance feature).
User uploads the specific bookmarks file to our app.
Our app parses the file, extracts the URLs, and standardizes the data.
Discussion Points: Should parsing happen on the client-side (browser) to save server costs, or on the backend? How do we handle large file sizes (e.g., 50MB+ JSON files)?
Strategy C: Browser Extension Scraper (Web-Based Fallback)
Target Platforms: Any web-accessible platform (Instagram Web, TikTok Web).
Mechanism: Content Scripts and DOM Manipulation.
Flow:
User installs our companion browser extension.
User navigates to their instagram.com/username/saved page.
Extension injects a script, scrolls to load thumbnails, extracts href tags, and POSTs the payload to our app's backend.
Discussion Points: Extension maintenance (if Instagram changes their CSS classes, the scraper breaks).
3. Universal Data Normalization (Core Architecture)
Since data comes from multiple platforms in wildly different formats, our system needs a "Normalization Layer." Every imported item must be transformed into a standard Universal Bookmark Object before saving to the database.
Proposed Standard Schema:
code
TypeScript
interface NormalizedBookmark {
  userId: string;          // ID of the user importing
  originalUrl: string;     // The actual URL of the saved content
  title: string | null;    // Extracted title (if available)
  platform: string;        // e.g., 'instagram', 'x', 'reddit', 'browser'
  importedAt: Date;        // Timestamp of import
  mediaType: string;       // e.g., 'video', 'image', 'text', 'article'
  sourceId: string | null; // Original ID from the platform (to prevent duplicates)
}
4. User Experience (UX) Flow
Integration Hub: User navigates to a "Settings > Import Bookmarks" page.
Selection: User selects a platform from a grid of icons (e.g., Instagram).
Dynamic UI:
If X/Reddit: Shows a "Connect Account" button.
If Instagram/TikTok: Shows a file dropzone with a link to instructions: "How to download your Instagram data."
Preview State: App displays a summary: "We found 432 saved items. Click 'Confirm' to save to your library."
Background Processing: App uploads/saves the items. A progress bar is shown to the user.
5. Edge Cases & Technical Considerations
Deduplication: Users might run the import multiple times or import the same data export file twice. The database must use a unique constraint (e.g., combining userId + originalUrl) to ignore duplicates seamlessly.
Dead Links: Social media posts get deleted. Should we validate if the URLs still exist during import, or just save the raw URLs and let them fail on the frontend if the user clicks them?
Platform Schema Changes: If Instagram changes the structure of their saved_posts.json file in the future, our parser will break. We need a robust error-handling system that logs parsing failures so we can update our mapping logic.
Batch Database Inserts: Inserting 5,000 bookmarks one by one will crash the server or database. We must use Batch/Bulk insert operations (e.g., SQL INSERT INTO ... VALUES (), (), () or Prisma createMany).
6. Proposed Implementation Roadmap
To avoid overwhelm, we should build this in phases:
Phase 1: Build the core Normalization Layer and Database Batch Insert logic.
Phase 2: Implement Data Export Parsing (JSON) for Instagram and TikTok (easiest to start, no API keys needed).
Phase 3: Implement OAuth Integration for Reddit and X (requires setting up developer accounts and handling tokens).
Phase 4: (Optional) Develop the Browser Extension for frictionless web scraping.
edit:- Currently we will be working on platforms like youtube , google and chrome bookmarks as our main priority platform other platforms are not necessary as of right now and js will be used instead of typescript