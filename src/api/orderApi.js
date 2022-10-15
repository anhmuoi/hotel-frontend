import axiosClient from './axiosClient.js';

const orderApi = {
    async getAll(params) {
        const RoomOrderList = await axiosClient.get('/api/order', { params });
        console.log(RoomOrderList);

        return {
            data: RoomOrderList.data.data,
            pagination: RoomOrderList.data.pagination,
        };
    },
    getAllOrder() {
        const url = `/api/order`;
        return axiosClient.get(url);
    },
    getId(id) {
        const url = `/api/order/${id}`;
        return axiosClient.get(url);
    },
    getOrderListByRoom(params) {
        const url = `/api/order`;
        return axiosClient.get(url, { params });
    },
    create(params) {
        const url = `/api/order`;
        return axiosClient.post(url, params);
    },
    update(params, id) {
        const url = `/api/order/${id}`;
        return axiosClient.patch(url, params);
    },
    delete(id) {
        const url = `/api/order/${id}`;
        return axiosClient.delete(url);
    },
    getTotalPrice() {
        const url = `/api/order/totalPrice`;
        return axiosClient.get(url);
    },
};

export default orderApi;
