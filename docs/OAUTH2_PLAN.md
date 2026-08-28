# OAuth 2.0 Integration Plan — BMS App

## Overview

This document covers the implementation plan for connecting BMS to Google/YouTube
via OAuth 2.0 so users can authorize the app to read their YouTube data.

References:
- [Google OAuth 2.0 for Web Server Apps](https://developers.google.com/identity/protocols/oauth2/web-server)
- [YouTube Data API v3 Node.js Quickstart](https://developers.google.com/youtube/v3/quickstart/nodejs)

---

## ⚠️ Do This Before Starting OAuth

**Deploy the app first.** OAuth requires a registered redirect URI.
`localhost` works for development but Google blocks sensitive scopes on localhost
during OAuth verification review. Having a live URL from day one avoids
redoing everything post-deployment.

Minimum deployment setup:
- Backend → Render or Railway (free tier)
- Frontend → Vercel (free tier)
- Add both localhost AND production URIs to Google Cloud Console

---

## How OAuth 2.0 Authorization Code Flow Works

```
User clicks "Connect YouTube"
        ↓
Frontend does: window.location.href = "/api/v1/oauth/youtube/connect"
(NOT axios — browser must navigate to trigger redirect)
        ↓
Backend redirects to Google's consent screen
(GET https://accounts.google.com/o/oauth2/auth?client_id=...&scope=...&state=...&redirect_uri=...)
        ↓
User approves — Google redirects back to your redirect_uri with a `code`
(GET http://localhost:3000/api/v1/oauth/youtube/callback?code=4/abc123...&state=...)
        ↓
Your backend:
  1. Verify state parameter (CSRF protection)
  2. Exchange code for tokens via POST https://oauth2.googleapis.com/token
        ↓
Google returns: { access_token, refresh_token, expires_in }
        ↓
Store tokens in OAuthToken collection
Redirect user back to /import page on frontend
```

Key facts:
- `code` is single-use, expires in minutes
- `access_token` expires in 1 hour — always check `expiresAt` before API calls
- `refresh_token` is long-lived — use it silently to get new access tokens
- `refresh_token` is only returned ONCE on first authorization — store it immediately

---

## Google Cloud Console Setup (Do This First)

1. Go to https://console.cloud.google.com
2. Create a new project: "BMS-App"
3. Enable APIs:
   - YouTube Data API v3 (required)
   - ~~Google People API~~ — NOT needed, we get user identity from our own JWT
4. Configure OAuth Consent Screen:
   - User type: External
   - Add test users (your own Google account) while in development
   - App will stay in "Testing" mode until Google review
5. Create credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/v1/oauth/youtube/callback` (development)
     - `https://yourdomain.com/api/v1/oauth/youtube/callback` (production)
6. Copy Client ID and Client Secret → add to Backend `.env`

---

## Required Scopes

```
https://www.googleapis.com/auth/youtube.readonly
```

This single scope gives read access to:
- Liked videos playlist
- User's playlists
- Watch Later playlist
- Video metadata (title, tags, description, categoryId)

No write access requested — reduces friction on consent screen.

⚠️ Note: YouTube Liked Videos (`playlistItems?playlistId=LL`) may require
the user to have their liked videos set to public OR require app verification
for the `youtube.readonly` scope. Test with your own account first.

---

## Backend Changes Required

### New environment variables (`Backend/.env`)

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/oauth/youtube/callback
```

### New package to install

```bash
cd Backend
npm install googleapis
```

`googleapis` is Google's official Node.js client — handles token exchange,
refresh, and API calls automatically.

### New Schema — `OAuthToken.schema.js`

```js
// Backend/MongoDB/Models/OAuthToken.schema.js
{
  userId:        { type: ObjectId, ref: "User", required: true },
  platform:      { type: String, enum: ["youtube"], required: true },
  accessToken:   { type: String, required: true },
  refreshToken:  { type: String, required: true },  // encrypt this
  expiresAt:     { type: Date, required: true },
  scope:         { type: String }
}
// Compound index — one token per user per platform
OAuthTokenSchema.index({ userId: 1, platform: 1 }, { unique: true })
```

### New Routes — `oauth.routes.js`

```
GET    /api/v1/oauth/youtube/connect    → VerifyJWT + connect()
GET    /api/v1/oauth/youtube/callback   → callback() — NO VerifyJWT (Google redirects here)
GET    /api/v1/oauth/youtube/status     → VerifyJWT + status()
DELETE /api/v1/oauth/youtube/revoke     → VerifyJWT + revoke()
```

⚠️ `callback` has no `VerifyJWT` — user is not logged in during redirect.
Use the `state` parameter to carry the userId securely through the OAuth flow.

### Register route in `app.js`

```js
import oauthRouter from "./Routes/oauth.routes.js"
app.use("/api/v1/oauth", oauthRouter)
```

### New Controller — `OAuthController.js`

```
connect()
  → build state = sign JWT with { userId } using ACCESS_TOKEN_SECRET
  → build Google OAuth URL with client_id, redirect_uri, scope, state
  → res.redirect(googleOAuthUrl)

callback()
  → verify state parameter → extract userId
  → exchange code for tokens using googleapis
  → store/update OAuthToken document for this userId + platform
  → res.redirect("http://localhost:5173/import?connected=true")

status()
  → find OAuthToken where { userId: req.user._id, platform: "youtube" }
  → return { connected: true/false, expiresAt }

revoke()
  → delete OAuthToken document
  → optionally call https://oauth2.googleapis.com/revoke
```

---

## Token Refresh Logic

Before every YouTube API call, check if token is expired:

```js
const token = await OAuthToken.findOne({ userId, platform: "youtube" })

if (Date.now() > token.expiresAt) {
  // refresh silently
  const { credentials } = await oauth2Client.refreshAccessToken()
  await OAuthToken.findOneAndUpdate(
    { userId, platform: "youtube" },
    { accessToken: credentials.access_token, expiresAt: new Date(credentials.expiry_date) }
  )
}
```

Build this as a utility function — `getValidToken(userId)` — reused by all YouTube routes.

---

## Frontend Changes Required

### New API file — `src/api/oauthApi.js`

```js
// getYoutubeStatus — axios GET
export const getYoutubeStatus = () => axiosService.get("/oauth/youtube/status")

// connectYoutube — NOT axios, must use window.location redirect
export const connectYoutube = () => {
  window.location.href = "/api/v1/oauth/youtube/connect"
}

// revokeYoutube — axios DELETE
export const revokeYoutube = () => axiosService.delete("/oauth/youtube/revoke")
```

### New route in `App.jsx`

```jsx
// Protected — user must be logged in to import
<Route element={<ProtectedRoute />}>
  <Route path="/import" element={<ImportPage />} />
</Route>
```

### Callback redirect handling in `ImportPage.jsx`

After OAuth, Google redirects to backend which redirects to `/import?connected=true`.
Check this query param on mount to show success message:

```js
const [searchParams] = useSearchParams()
const justConnected = searchParams.get("connected") === "true"
```

---

## Security Checklist

- [ ] Never expose `GOOGLE_CLIENT_SECRET` to frontend
- [ ] Use `state` parameter (signed JWT) to prevent CSRF
- [ ] Encrypt `refreshToken` before storing in MongoDB (use `crypto.createCipheriv`)
- [ ] Always verify `state` in callback before processing
- [ ] Check `expiresAt` before every YouTube API call
- [ ] Tokens are scoped per user — never share between users

---

## Quota

YouTube Data API v3 default quota: **10,000 units/day** per project.

| Operation | Cost |
|-----------|------|
| `playlistItems.list` (50 videos) | 1 unit |
| `videos.list` (50 video details) | 1 unit |
| `playlists.list` | 1 unit |

Fetching + detailing 2500 liked videos ≈ **100 units total** — well within limits.

---

## Implementation Order

```
1. Deploy app (backend + frontend)
2. Google Cloud Console setup
3. Install googleapis in Backend
4. Create OAuthToken schema
5. Write connect() + callback() — test full OAuth flow
6. Write getValidToken() refresh utility
7. Write status() + revoke()
8. Add frontend oauthApi.js + connect UI on ImportPage
9. Proceed to YouTube fetch in BULK_IMPORT_PLAN.md Phase 3
```

---

## Status

⬜ Not started — implement after core app is complete and deployed
