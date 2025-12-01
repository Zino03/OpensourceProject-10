import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.31.157:8080", // 백엔드 주소
  // baseURL: "http://192.168.31.28:8080", // 백엔드 주소
  headers: {
    "Content-Type": "application/json",
  },
});

export const setInterceptor = (token) => {
  if (!token) return false;
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return true;
};
