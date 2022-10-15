import axiosClient from './axiosClient.js';

const userApi = {
    getAll() {
        const url = `/api/users`;
        return axiosClient.get(url);
    },
    getId(id) {
        const url = `/api/users/${id}`
        return axiosClient.get(url);

    },
    put(params, id) {
        const url = `/api/users/${id}`;
        return axiosClient.patch(url, params );
    },
    delete(id) {
        const url = `/api/users/${id}`;
        return axiosClient.delete(url);
    },
};

export default userApi;
