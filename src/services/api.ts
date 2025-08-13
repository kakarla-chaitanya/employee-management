import axios from "axios";
const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials:true
});

// Add request interceptor
api.interceptors.request.use((config) => {
  (config as any).metadata = { startTime: new Date() };
  return config;
});

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    const metadata = (response.config as any).metadata;
    metadata.endTime = new Date();
    metadata.duration = metadata.endTime.getTime() - metadata.startTime.getTime();

    (response as any).duration = metadata.duration;
    return response;
  },
  (error) => {
    const metadata = (error.config as any)?.metadata;
    if (metadata) {
      metadata.endTime = new Date();
      metadata.duration = metadata.endTime.getTime() - metadata.startTime.getTime();
      (error as any).duration = metadata.duration;
    }
    return Promise.reject(error);
  }
);


export default api;