import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === "development" ? "http://localhost:5100/api" : "https://voxance-backend.onrender.com/api",
    withCredentials: true
})