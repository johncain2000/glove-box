import axios from "axios"
import store from "@/state/store";

axios.interceptors.request.use(function (config) {
    const token = store.getters['getToken'];
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

const backendUrl = process.env.VUE_APP_BACKEND_URL || "";

export default {
  async getAssets(interval) {
    let res = await axios.get(`${backendUrl}/assets/` + interval);
    return res.data;
  },
  async login(credentials) {
    let res = await axios.post(`${backendUrl}/login`, credentials);
    return res.data;
  },
  async checkToken() {
    let res = await axios.get(`${backendUrl}/check-token`);
    return res.data;
  },
}