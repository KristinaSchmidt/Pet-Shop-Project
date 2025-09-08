import axios from "axios";


export const API_BASE = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});


api.interceptors.request.use((cfg) => {
  console.log("[API][REQ]", cfg.method?.toUpperCase(), API_BASE + cfg.url);
  return cfg;
});
api.interceptors.response.use(
  (res) => {
    console.log("[API][RES]", res.status, res.config?.url);
    return res.data;
  },
  (err) => {
    console.error("[API][ERR]", err?.response?.status, err?.config?.url, err?.response?.data || err.message);
    return Promise.reject(err);
  }
);


export function apiImg(path = "") {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}
