import axios from 'axios';
import { default as authConfig } from "../config.json";

const axiosInstance = axios.create({
    baseURL: authConfig.apiUrl
});

export default axiosInstance;
