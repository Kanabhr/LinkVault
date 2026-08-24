# OAuth 2.0 Integration Plan — BMS App

## Overview

This document covers the implementation plan for connecting BMS to Google/YouTube
via OAuth 2.0 so users can authorize the app to read their YouTube data.

References:
- [Google OAuth 2.0 for Web Server Apps](https://developers.google.com/identity/protocols/oauth2/web-server)
- [YouTube Data API v3 Node.js Quickstart](https://developers.google.com/youtube/v3/quickstart/nodejs)

---

## How OAuth 2.0 Authorization Code Flow Works

```
User clicks "Connect YouTube"
        ↓
Frontend redirects to Google's consent screen
(GET https://accounts.google.com/o/oauth2/auth?client_id=...&scope=...&redirect_uri=...)
        ↓
User approves — Google redirects back to your redirect_uri with a `code`
(GET http://localhost:3000/api/v1/oauth/youtube/callback?code=4/abc123...)
        ↓
Your backend exchanges the code for tokens
(POST https://oauth2.googleapis.com/token)
        ↓
Google returns: { access_token, refresh_token, expires_in }
        ↓
Store tokens securely, use access_token to call YouTube API
```

The `code` is single-use and expires in minutes. The `access_token` expires in 1 hour.
The `refresh_token` is long-lived — use it to get new access tokens silently.

---

## Google Cloud Console Setup (Do This First)

1. Go to https://console.cloud.google.com
2. Create a new project: "BMS-App"
3. Enable APIs:
   - YouTube Data API v3
   - Google People API (for user profile)
4. Create credentials → OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URIs:
     - `http://localhost:3000/api/v1/oauth/youtube/callback` (development)
     - `https://yourdomain.com/api/v1/oauth/youtube/callback` (production)
5. Copy Client ID and Client Secret → add to Backend `.env`

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
npm install googleapis
```

`googleapis` is Google's official Node.js client — handles token exchange,
refresh, and API calls. No need to implement OAuth manually.
([npm](https://www.npmjs.com/package/googleapis))

### New Schema — store OAuth tokens per user

```js
// Backend/MongoDB/Models/OAuthToken.schema.js
{
  userId:        ObjectId (ref: User),
  platform:      String   ('youtube'),
  accessToken:   String,
  refreshToken:  String,
  expiresAt:     Date,
  scope:         String
}
```

Tokens are stored per user per platform. When access_token expires,
use refresh_token to get a new one silently.

### New Routes

```
GET  /api/v1/oauth/youtube/connect    → generate consent URL, redirect user
GET  /api/v1/oauth/youtube/callback   → exchange code for tokens, store them
GET  /api/v1/oauth/youtube/status     → check if user has connected YouTube
DELETE /api/v1/oauth/youtube/revoke   → disconnect YouTube, delete tokens
```

### New Controller — `OAuthController.js`

```
connect()    → build Google OAuth URL with scopes, redirect
callback()   → exchange code → get tokens → store in OAuthToken collection
status()     → find OAuthToken for user → return { connected: true/false }
revoke()     → delete OAuthToken, optionally call Google revoke endpoint
```

---

## Frontend Changes Required

### New API function (`Frontend/api/oauthApi.js`)

```js
getYoutubeStatus    → GET /oauth/youtube/status
connectYoutube      → redirect window to /oauth/youtube/connect
revokeYoutube       → DELETE /oauth/youtube/revoke
```

Note: `connectYoutube` uses `window.location.href` redirect, not axios,
because it needs to navigate the browser to Google's consent screen.

### New UI (on Import page)

```
[ Connect YouTube ]  ← button, redirects to Google consent
Status: Connected ✓  ← shown after callback
[ Disconnect ]       ← revoke button
```

---

## Security Considerations

- Never expose `client_secret` to the frontend — all token exchange happens backend only
- Store `refreshToken` encrypted in MongoDB (use `crypto` module or a library)
- Use `state` parameter in OAuth URL to prevent CSRF attacks
- Set token `expiresAt` and check before each API call — refresh proactively
- Tokens are per-user — one user's tokens never touch another user's requests

---

## Quota

YouTube Data API v3 default quota: **10,000 units/day** per project.

| Operation | Cost |
|-----------|------|
| `playlistItems.list` (fetch 50 videos) | 1 unit |
| `videos.list` (get video details) | 1 unit |
| `playlists.list` (get user playlists) | 1 unit |

Fetching 2500 liked videos in batches of 50 = 50 API calls = 50 units.
Getting full details for 2500 videos = 50 calls = 50 units.
Total for one full import of 2500 videos ≈ **100-150 units** — well within limits.

To increase quota: submit a quota extension request in Google Cloud Console
(requires app review for sensitive scopes).

---

## Implementation Order

1. Google Cloud Console setup + credentials
2. Install `googleapis` package
3. Create `OAuthToken` schema
4. Implement `connect` and `callback` routes (core OAuth flow)
5. Test consent screen → callback → tokens stored
6. Implement `status` and `revoke` routes
7. Add frontend connect/disconnect UI
8. Proceed to Bulk Import implementation

---

## Status

⬜ Not started — implement after core app is complete
