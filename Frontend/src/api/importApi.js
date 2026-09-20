import axiosService from "./axios";

const apiurl = import.meta.VITE_API_URL || "/api/v1";
// sends .html file to backend — returns preview array, no DB write
export const chromePreview = (file) => {
  const formData = new FormData();
  formData.append("chromebmimport", file); // must match multer field name
  return axiosService.post("/import/chrome/preview", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// sends confirmed preview to backend — writes to DB, returns { inserted, skipped }
export const chromeConfirm = (previewData) => axiosService.post("/import/chrome/confirm", { links: previewData });

export const connectYoutube = () => (window.location.href = `${apiurl}/oauth/youtube/connect`);

export const getYouTubeStatus = () => axiosService.get("/oauth/youtube/status");

export const revokeYouTube = () => axiosService.delete("/oauth/youtube/revoke");

export const getYouTubePlaylists = () => axiosService.get("/oauth/youtube/playlists");

export const youtubePreview = (type, playlistId) => axiosService.post("/oauth/youtube/preview", { type, playlistId });

export const youtubeConfirm = (previewData) => axiosService.post("/oauth/youtube/confirm", { links: previewData });
