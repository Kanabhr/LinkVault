# YoutubeHelper.js — How to Read the Documentation

This document explains how to use the YouTube Data API v3 documentation to implement the functions in `YoutubeHelper.js`. No code — just how to read and translate docs into implementation.

---

## How the googleapis Library Works

The YouTube Data API is an HTTP API. Every endpoint in the docs maps directly to a method in the `googleapis` Node.js library. The translation rule is simple:

- The API endpoint name becomes the method name
- The HTTP query parameters become properties of the object you pass to that method
- The HTTP response body is what the library returns

So when you see this in the docs:
```
GET /playlists
?part=snippet,contentDetails
&mine=true
```

In the library it becomes:
```
youtubeclient.playlists.list({ part: [...], mine: true })
```

Same param names. Same values. The library handles the HTTP part for you.

---

## How to Implement Any YouTube Function — The Universal Pattern

Every YouTube API function you will ever write follows the same structure. This pattern was derived from Google's own example code:

```
// old callback style from Google's docs — for reference only
service.channels.list({
  auth: auth,
  part: 'snippet,contentDetails,statistics',
  forUsername: 'GoogleDevelopers'
}, function(err, response) {
  var channels = response.data.items;
})
```

Translated to modern async/await (what you use):
```
const response = await youtubeclient.{resource}.list({ part: '...', ...params })
const items = response.data.items
```

The structure never changes. Only three things vary between functions:

### 1. The resource name
This comes directly from the YouTube API docs. The available resources are:
- `videos` — individual video data
- `playlists` — playlist metadata
- `playlistItems` — videos inside a playlist
- `channels` — channel data
- `subscriptions` — user subscriptions
- `search` — cross-resource search

Whatever resource the docs describe, that becomes the property name on your YouTube client.

### 2. The params object
Read the API docs for that resource's `list` method. The params section tells you:
- Which params are **required** (always need `part`)
- Which are **filters** (pick exactly one)
- Which are **optional** (use only what you need)

Copy the param names exactly as written in the docs — they are case sensitive.

### 3. The response path
Always starts with `response.data.items` for list methods. Then you navigate the nested structure shown in the resource representation section of the docs.

---

## Two Ways to Pass Auth — Know Both

**Method 1 — Auth on the client (what we use):**
```
const youtubeclient = google.youtube({ version: 'v3', auth: oauth2client })
```
Auth is set once when creating the client. Every call made through this client is automatically authenticated. This is the correct approach for a multi-user server.

**Method 2 — Auth inside each call (from Google's old examples):**
```
service.channels.list({ auth: auth, part: '...' })
```
Auth is passed with every individual API call. Works fine but repetitive. You'll see this in older Google examples and GitHub repos.

Both produce identical results. When you find an old example using Method 2, you can safely use Method 1 instead — just don't pass `auth` in the params, it's already on the client.

---

## Callback Style vs Async/Await

Google's older documentation and GitHub examples use callback style:
```
service.channels.list({ part: '...' }, function(err, response) {
  // handle response here
})
```

All googleapis methods also support Promises and therefore async/await:
```
const response = await youtubeclient.channels.list({ part: '...' })
```

Always use async/await. When you find a callback-style example in the docs or GitHub, mentally translate it — the params and response structure are identical, only the syntax changes.

---

## Step-by-Step: How to Build a New YouTube Function from Scratch

When you need to fetch any new type of YouTube data in the future, follow these steps:

**Step 1 — Identify the resource**
What data do you need? Find which YouTube resource contains it from the API docs index at `developers.google.com/youtube/v3/docs`.

**Step 2 — Find the list method**
Go to that resource's `list` page. Read the required and optional parameters.

**Step 3 — Determine which `part` values you need**
Look at the resource representation JSON. Find where your target fields are nested. The top-level key containing them is the `part` name you need to request.

**Step 4 — Note the filter**
If there's a Filters section, pick the one that matches your use case. You can only use one filter per request.

**Step 5 — Check the response structure**
The response always has `data.items` for list methods. Navigate the JSON structure in the docs to find the exact nested path for each field you need.

**Step 6 — Write the function**
- Create YouTube client with `google.youtube({ version: 'v3', auth: oauth2client })`
- Call `await youtubeclient.{resource}.list({ part, ...yourParams })`
- Guard against empty `response.data.items`
- Map items to a clean object with only the fields you need
- Return the array

---

## How to Read the `part` Parameter

Every YouTube API method has a required `part` parameter. This is the most important parameter to understand.

`part` controls which sections of the resource object get included in the response. If you don't request a part, that section won't exist in the response at all — you'll get `undefined` when you try to access it.

Think of it as telling the API: "I only want these sections of the data."

**Example:** A playlist resource has these parts available: `snippet`, `contentDetails`, `status`, `player`, `localizations`.

- If you pass `part: ["snippet"]` — you get title, thumbnails, description
- If you pass `part: ["contentDetails"]` — you get itemCount
- If you pass `part: ["snippet", "contentDetails"]` — you get both

Always request only the parts you actually need. Requesting unnecessary parts wastes bandwidth and quota.

---

## How to Read the Response Structure

Every API method doc has a "Response" or "Resource representation" section showing a JSON structure. This tells you exactly where each piece of data lives.

**Reading nested paths:**
When the docs show:
```json
{
  "snippet": {
    "title": string,
    "thumbnails": {
      "medium": {
        "url": string
      }
    }
  }
}
```

You access `title` as `item.snippet.title` and the thumbnail URL as `item.snippet.thumbnails.medium.url`.

The nesting in the JSON structure is the exact path you write in your code.

---

## How to Read Filter Parameters

Some API methods have a "Filters" section — a group of parameters where you can only use **one at a time**. The docs will say "specify exactly one of the following."

**Example from Videos: list:**
- `chart` — returns popular videos
- `id` — returns specific videos by ID
- `myRating` — returns videos rated by the authenticated user

You pick one. Using `myRating: "like"` tells the API to return only videos the authenticated user has liked. You cannot combine `myRating` with `chart` or `id` in the same request.

---

## Reading the `mine` Parameter

When a parameter says it returns resources owned by "the authenticated user" and shows `mine: true`, this means the OAuth2 credentials on your client determine whose data comes back. The user whose tokens you loaded via `setCredentials` is the "authenticated user."

This is why `getValidOAuthClient` must run before any fetch function — without valid credentials loaded on the client, `mine: true` has no user to look up and the request will fail with a 401.

---

## Function by Function — What to Look For in the Docs

### `fetchUserPlaylists`

**Doc to use:** Playlists: list — `GET /playlists`

**What to look for:**
- The `mine` parameter — what value makes it return the authenticated user's playlists
- The `part` parameter — which parts give you title, thumbnails, and item count
- The resource representation — where `id`, `snippet.title`, `snippet.thumbnails.medium.url`, and `contentDetails.itemCount` are located in the response

**Key insight from the doc:**
The first implementation example shows `part=snippet,contentDetails&mine=true`. This tells you both parts are needed — `snippet` for the visual info and `contentDetails` for the count.

---

### `fetchPlaylistVideos`

**Doc to use:** PlaylistItems: list — `GET /playlistItems`

**What to look for:**
- The `playlistId` parameter — this is how you tell the API which playlist's videos to return
- The `part` parameter — which parts give you the video title, thumbnail, and the actual video ID
- The resource representation — pay close attention here. A playlist item is NOT a video resource. The video ID is nested inside `contentDetails.videoId`, not at `item.id`. The `item.id` is the playlist item's own ID, which is useless to you.
- `snippet.videoOwnerChannelTitle` — this is where the channel name lives in a playlist item, different from a video resource where it's `snippet.channelTitle`

**Key insight from the doc:**
You need both `snippet` and `contentDetails` parts — `snippet` for title and thumbnails, `contentDetails` for the `videoId` that you use to build the YouTube URL.

---

### `fetchLikedVideos`

**Doc to use:** Videos: list — `GET /videos`

**What to look for:**
- The Filters section — find `myRating` and what value returns liked videos
- The `part` parameter — which part gives you title, channel name, and thumbnails
- The `maxResults` parameter — note the doc says the maximum value when used with `myRating` is 50, not the default of 5
- The resource representation — for a video resource, `item.id` IS the video ID (unlike playlist items where it isn't)

**Key insight from the doc:**
A video resource's `snippet` contains `title`, `channelTitle`, and `thumbnails` all in one part. One part request gets you everything you need.

---

## How to Build a URL from a Video ID

The YouTube watch URL pattern is fixed:
```
https://www.youtube.com/watch?v={videoId}
```

You get `videoId` from:
- `fetchLikedVideos` — `item.id` (video resource)
- `fetchPlaylistVideos` — `item.contentDetails.videoId` (playlist item resource)

This difference between the two is a common mistake — always check whether you're working with a video resource or a playlist item resource.

---

## Thumbnail Sizes — Which to Use

From the Thumbnails section of the docs, the available sizes are:

| Key | Width | Height | Best for |
|---|---|---|---|
| default | 120px | 90px | Too small for a preview card |
| medium | 320px | 180px | Good for preview cards |
| high | 480px | 360px | Larger cards |
| standard | 640px | 480px | Full-size previews |
| maxres | 1280px | 720px | Overkill for a list |

Use `medium` for the preview list — it's the right balance between quality and load time.

**Important:** Not every video has every thumbnail size. `medium` is reliably present on all videos. Higher sizes may be missing for older or lower-quality videos.

---

## Authorization — What the Docs Mean by "Authorized Request"

When the docs say a parameter "can only be used in a properly authorized request," it means the API call must include a valid OAuth2 access token — not just an API key.

In your implementation, this is handled automatically because you pass `auth: oauth2client` when creating the YouTube client, and that client has credentials loaded from `getValidOAuthClient`. So every call made through that client is automatically authorized.

If you ever see a 401 or 403 error from the YouTube API, the first thing to check is whether `getValidOAuthClient` ran correctly before the fetch function was called.

---

## Quota — Something the Docs Always Mention

Every YouTube Data API call costs quota units. Your project has a daily quota limit (default 10,000 units per day on a free Google Cloud project).

- `videos.list` costs 1 unit per call
- `playlists.list` costs 1 unit per call
- `playlistItems.list` costs 1 unit per call

This is low — not something to worry about for a bookmark manager. But it's why the docs exist and why you should never call the API in a loop unnecessarily. One call with `maxResults: 50` is always better than 50 calls with `maxResults: 1`.
