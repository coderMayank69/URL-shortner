import axiosInstance from "../utils/axiosInstance";

// POST /api/url/shorten — create a short URL
export const createShortUrl = async (url, slug, expiresAt) => {
  const { data } = await axiosInstance.post("/api/url/shorten", { url, slug, expiresAt });
  return data; // { shortUrl, shortCode }
};

// DELETE /api/url/:shortCode — delete a short URL
export const deleteShortUrl = async (shortCode) => {
  const { data } = await axiosInstance.delete(`/api/url/${shortCode}`);
  return data;
};

// GET /api/analytics/:urlId — get analytics for a URL
export const getAnalytics = async (urlId) => {
  const { data } = await axiosInstance.get(`/api/analytics/${urlId}`);
  return data;
};
