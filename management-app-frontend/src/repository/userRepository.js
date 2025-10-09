import axiosInstance from "../axios/axios.js";

const userRepository = {
    register: async (data) => {
        return  axiosInstance.post("/users/register", data);
    },
    login: async (data) => {
        console.log('Sending login data:', data);
        return axiosInstance.post("/users/login", data);
    },
    getAllManagers: async () => {
        return axiosInstance.get("/users/managers");
    },
    findAll: async () => {
        return axiosInstance.get("/users");
    }
};
export default userRepository;