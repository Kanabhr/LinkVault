import { google } from "googleapis";
import { OAuthToken } from "../MongoDB/Models/OAuthToken.schema.js";
import { ApiError } from "./ApiError.js";

const oauth2client = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);

export const getValidOAuthClient = async (userId) => {
  const newquery = await OAuthToken.findOne({ userId, platform: "youtube" });
  if (!newquery) {
    throw new ApiError(401, "YouTube account not connected");
  }
  const bufferTime = Date.now() + 5 * 60 * 1000;
  if (newquery.expiresAt < bufferTime) {
    oauth2client.setCredentials({ refresh_token: newquery.refreshToken });
    const refresh = await oauth2client.refreshAccessToken();
    await OAuthToken.findOneAndUpdate(
      { userId, platform: "youtube" },
      {
        accessToken: refresh.credentials.access_token,
        expiresAt: new Date(refresh.credentials.expiry_date),
      },
    );
    oauth2client.setCredentials({
      access_token: refresh.credentials.access_token,
      refresh_token: newquery.refreshToken,
    });
  } else {
    oauth2client.setCredentials({
      access_token: newquery.accessToken,
      refresh_token: newquery.refreshToken,
    });
  }
  return oauth2client;
};

export const fetchUserPlaylists = async (oauth2client) => {
  const youtubeclient = google.youtube({ version: "v3", auth: oauth2client });
  const playlistfetch = await youtubeclient.playlists.list({
    mine: true,
    maxResults: 50,
    part: "snippet,contentDetails",
  });
  if (!playlistfetch.data.items || playlistfetch.data.items.length === 0) {
    return [];
  }
  return playlistfetch.data.items.map((item) => ({
    playlistId: item.id,
    title: item.snippet.title,
    thumbnailUrl: item.snippet.thumbnails.medium.url,
    itemCount: item.contentDetails.itemCount,
  }));
};

export const fetchPlaylistVideos = async (oauth2client, PlaylistId) => {
  const youtubeclient = google.youtube({ version: "v3", auth: oauth2client });
  const allVideos = [];
  let nextPageToken = undefined;

  do {
    const response = await youtubeclient.playlistItems.list({
      playlistId: PlaylistId,
      maxResults: 50,
      part: "snippet,contentDetails",
      pageToken: nextPageToken,
    });
    if (!response.data.items || response.data.items.length === 0) break;
    nextPageToken = response.data.nextPageToken;
    const pageItems = response.data.items || [];
    pageItems.forEach((item) =>
      allVideos.push({
        url: `https://www.youtube.com/watch?v=${item.contentDetails.videoId}`,
        title: item.snippet.title,
        channelTitle: item.snippet.videoOwnerChannelTitle,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
      }),
    );
  } while (nextPageToken);

  return allVideos;
};

export const fetchLikedVideos = async (oauth2client) => {
  const youtubeclient = google.youtube({ version: "v3", auth: oauth2client });
  const allVideos = [];
  let nextPageToken = undefined;

  do {
    const response = await youtubeclient.videos.list({
      myRating: "like",
      part: "snippet",
      maxResults: 50,
      pageToken: nextPageToken,
    });
    if (!response.data.items || response.data.items.length === 0) break;
    nextPageToken = response.data.nextPageToken;
    const pageItems = response.data.items || [];
    pageItems.forEach((item) =>
      allVideos.push({
        url: `https://www.youtube.com/watch?v=${item.id}`,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails.medium.url,
      }),
    );
    break;
  } while (nextPageToken);

  return allVideos;
};
