import axiosClient from './axiosClient.js';

const orderApi = {
    async getAll(params) {
        const RoomOrderList = await axiosClient.get('/order/list', { params });

        return {
            data: RoomOrderList.data.data,
            pagination: {
                page: params.page,
                limit: params.limit,
                time_start: params.time_start,
                time_end: params.time_end,
            },
        };
    },
    create(params) {
        const url = `/order/create`;
        return axiosClient.post(url, { params });
    },
    put(params, id) {
        const url = `/order/update/${id}`;
        return axiosClient.put(url, { params });
    },
    delete(params, id) {
        const url = `/order/delete/${id}`;
        return axiosClient.delete(url, { params });
    },
};

export default orderApi;
