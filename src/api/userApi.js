import axiosClient from './axiosClient.js';

const userApi = {
    getAll() {
        const url = `/user/list`;
        return axiosClient.get(url);
    },
    put(params, id) {
        const url = `/user/update/${id}`;
        return axiosClient.put(url, { params });
    },
    delete(params, id) {
        const url = `/user/delete/${id}`;
        return axiosClient.delete(url, { params });
    },
};

export default userApi;
