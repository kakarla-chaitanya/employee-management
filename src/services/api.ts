import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const apiUrl=process.env.API_URL;
const api=axios.create({
    baseURL:apiUrl,
    withCredentials:true
});
export default api;