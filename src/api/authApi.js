import axiosClient from "./axiosClient.js";


const authApi = {
 
    register(data) {
        const url = '/auth/register';
        return axiosClient.post(url, data);
    },
    login(data) {
        const url = '/auth/login';
        return axiosClient.post(url, data);
    },
};

export default authApi;