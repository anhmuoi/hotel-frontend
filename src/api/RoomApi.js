import axiosClient from './axiosClient.js';

const RoomApi = {
    async getAll(params) {
        const RoomList = await axiosClient.get('/room/list', { params });

        return {
            data: RoomList.data.data,
            pagination: {
                page: params.page,
                limit: params.limit,
            },
        };
    },
    create(params) {
        const url = `/room/create`;
        return axiosClient.post(url, { params });
    },
    put(params, id) {
        const url = `/room/update/${id}`;
        return axiosClient.put(url, { params });
    },
    delete(params, id) {
        const url = `/room/delete/${id}`;
        return axiosClient.delete(url, { params });
    },
};

export default RoomApi;
