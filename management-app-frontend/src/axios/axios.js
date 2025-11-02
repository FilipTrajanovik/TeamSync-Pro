import axios from "axios";


const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const jwtToken = localStorage.getItem("token");
        if (jwtToken) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }

        const sessionId = localStorage.getItem("sessionId");
        if (sessionId) {
            config.headers['X-Session-ID'] = sessionId;
        }

        return config;
    },
    (error) => {

        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    (response) => {

        return response;
    },
    (error) => {

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.log("Invalid token");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

