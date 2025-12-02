import axios from "axios";

export const BASE_URL = "http://192.168.31.28:8080";
// export const BASE_URL = "http://192.168.31.157:8080";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setInterceptor = (token) => {
  if (!token) return false;
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return true;
};
