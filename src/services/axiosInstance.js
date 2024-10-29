import axios from "axios";
import {BASE_URL} from "../utils/config";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;
