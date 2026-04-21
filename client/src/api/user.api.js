import axiosInstance from "../utils/axiosInstance";

export const loginUser = async (email, password) => {
  const { data } = await axiosInstance.post("/api/auth/login", { email, password });
  return data;
};

export const registerUser = async (name, email, password) => {
  const { data } = await axiosInstance.post("/api/auth/register", { name, email, password });
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosInstance.post("/api/auth/logout"); // POST (was GET — fixed)
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axiosInstance.get("/api/auth/me");
  return data;
};

// GET /api/url/user — get all URLs for the current user
export const getAllUserUrls = async () => {
  const { data } = await axiosInstance.get("/api/url/user");
  return data;
};