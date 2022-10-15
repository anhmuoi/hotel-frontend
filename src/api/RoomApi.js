import axiosClient from './axiosClient.js';

const RoomApi = {
    async getAll(params) {
        const RoomList = await axiosClient.get('/api/room', { params });
        console.log(RoomList.data);
        return {
            data: RoomList.data,
            pagination: RoomList.pagination

        };
    },
    getAllRoom() {
        const url = `/api/room`;
        return axiosClient.get(url);
    },
    getId(id) {
        const url = `/api/room/${id}`;
        return axiosClient.get(url);
    },
    create(params) {
        const url = `/api/room`;
        return axiosClient.post(url,  params );
    },
    put(params, id) {
        const url = `/api/room/${id}`;
        return axiosClient.patch(url, params);
    },
    delete(id) {
        const url = `/api/room/${id}`;
        return axiosClient.delete(url);
    },
};

export default RoomApi;
