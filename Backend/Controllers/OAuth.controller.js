import { OAuthToken } from "../MongoDB/Models/OAuthToken.schema.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { AsyncHandler } from "../Utils/AsyncHandler.js";
import { bulkInsert } from "./import.controller.js";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { getValidOAuthClient, fetchUserPlaylists, fetchLikedVideos, fetchPlaylistVideos } from "../Utils/YoutubeHelper.js";
import { categorizeWithGemini } from "../Utils/GeminiApi.js";
const oauth2client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

const connect = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const state = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
  const authUrl = oauth2client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    state: state,
    prompt: "consent",
  });
  res.redirect(authUrl);
});

const callback = AsyncHandler(async (req, res) => {
  try {
    const { code, state } = req.query;
    const decoded = jwt.verify(state, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded.userId;
    const { tokens } = await oauth2client.getToken(code);
    await OAuthToken.findOneAndUpdate(
      { userId, platform: "youtube" },
      {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt: new Date(tokens.expiry_date),
        scope: tokens.scope || "youtube.readonly",
      },
      { upsert: true },
    );
    res.redirect(`${process.env.FRONTEND_URL}/import?connected=true`);
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.redirect(`${process.env.FRONTEND_URL}/import?error=invalid_state`);
    }
    if (error.code >= 400) {
      return res.redirect(`${process.env.FRONTEND_URL}/import?error=oauth_failed`);
    }
    console.error("OAuth callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/import?error=callback_failed`);
  }
});

const status = AsyncHandler(async (req, res) => {
  const findOAuthtoken = await OAuthToken.findOne({ userId: req.user._id, platform: "youtube" });
  if (findOAuthtoken) {
    res.status(200).json(new ApiResponse(200, { connected: true, expiresAt: findOAuthtoken.expiresAt }, "YouTube connected"));
  } else {
    res.status(200).json(new ApiResponse(200, { connected: false }, "YouTube not connected"));
  }
});

const revoke = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const deletedToken = await OAuthToken.findOneAndDelete({
    userId,
    platform: "youtube",
  });
  if (!deletedToken) {
    throw new ApiError(404, "No YouTube connection found to revoke");
  }
  try {
    await oauth2client.revokeToken(deletedToken.accessToken);
  } catch (err) {
    console.error("Google-side token revocation failed:", err.message);
  }
  res.status(200).json(new ApiResponse(200, {}, "YouTube connection revoked successfully"));
});

const getPlaylists = AsyncHandler(async (req, res) => {
  const userytID = req.user._id;

  const validUserconnection = await getValidOAuthClient(userytID);
  const playlistArray = await fetchUserPlaylists(validUserconnection);

  res.status(200).json(new ApiResponse(200, playlistArray, "Playlist fetched successfully"));
});

const youtubePreview = AsyncHandler(async (req, res) => {
  const userytID = req.user._id;
  const { type, playlistID } = req.body;
  const validUserconnection = await getValidOAuthClient(userytID);

  let videos = [];

  if (type === "liked") {
    videos = await fetchLikedVideos(validUserconnection);
  } else if (type === "playlist") {
    if (!playlistID) throw new ApiError(400, "playlistId is required");
    videos = await fetchPlaylistVideos(validUserconnection, playlistID);
  } else {
    throw new ApiError(400, "Invalid Type");
  }
  if (videos.length === 0) {
    return res.status(200).json(new ApiResponse(200, { total: 0, preview: [] }, "No videos found"));
  }
  const geminiResults = await categorizeWithGemini(videos);
  const geminiMap = {};
  geminiResults.forEach((result) => {
    geminiMap[result.url] = result.customTag;
  });
  const preview = videos.map((video) => ({
    url: video.url,
    title: video.title,
    channelTitle: video.channelTitle,
    thumbnailUrl: video.thumbnailUrl,
    category: geminiMap[video.url] || "other",
  }));

  res.status(200).json(new ApiResponse(200, { total: preview.length, preview }, "Preview ready"));
});

const youtubeConfirm = AsyncHandler(async (req, res) => {
  const { links } = req.body;
  if (!links || links.length === 0) {
    throw new ApiError(400, "No links provided to import");
  }

  // 2. get userId from VerifyJWT middleware
  const userId = req.user._id;

  // 3. normalize each preview link into full urldata document shape
  const normalizedLinks = links.map((link) => ({
    userId,
    Linkdata: link.url,
    title: link.title,
    CategoriesbyDef: null,
    customTagId: null,
    platform: "youtube",
    mediatype: "video",
    importedAt: new Date(),
    confidence: "medium",
  }));

  // 4. bulk insert — handles duplicates silently via ordered:false
  const { inserted, skipped } = await bulkInsert(normalizedLinks);

  // 5. return counts
  res.status(200).json(
    new ApiResponse(
      200,
      {
        inserted,
        skipped,
      },
      "Import complete",
    ),
  );
});

export { connect, callback, status, revoke, getPlaylists, youtubeConfirm, youtubePreview };
