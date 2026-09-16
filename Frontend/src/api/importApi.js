import axiosService from "./axios"

// sends .html file to backend — returns preview array, no DB write
export const chromePreview = (file) => {
  const formData = new FormData()
  formData.append("chromebmimport", file)  // must match multer field name
  return axiosService.post("/import/chrome/preview", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
}

// sends confirmed preview to backend — writes to DB, returns { inserted, skipped }
export const chromeConfirm = (previewData) =>
  axiosService.post("/import/chrome/confirm", { links: previewData })

// connectYT main func is to redirect user to youtube
export const connectYoutube = () =>
  window.location.href ="/api/v1/oauth/youtube/connect"

// getytstatus main func is to get status
export const getYouTubeStatus = () =>
  axiosService.get("/oauth/youtube/status")

// revokeYouTube main func is to revoke yt access

export const revokeYouTube = () =>
  axiosService.delete("/oauth/youtube/revoke")

// 