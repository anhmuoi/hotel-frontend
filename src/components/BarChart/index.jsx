import React, { useEffect, useState } from 'react';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import orderApi from '../../api/orderApi.js';
import roomApi from '../../api/RoomApi.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart = () => {
    const [numberOrder, setNumberOrder] = useState([]);
    const [numberRoom, setNumberRoom] = useState([]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'biểu đồ số lượng order tại các phòng',
            },
        },
    };

    const data = {
        labels: numberRoom,
        datasets: [
            {
                label: 'số order',
                data: numberOrder,
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
    useEffect(() => {
        (async () => {
            try {
                const orderList = await orderApi.getAllOrder();
                const roomList = await roomApi.getAllRoom();
                const orderArr = [];
                const roomArr = [];
                for (let i = 0; i < roomList.data.length; i++) {
                    const count = orderList.data.filter((roomOrder) => roomOrder.room_id === +roomList.data[i].id);

                    orderArr.push(count.length);
                    roomArr.push(`phòng ${roomList.data[i].id}`);
                }
                setNumberOrder([...orderArr]);
                setNumberRoom([...roomArr]);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);


    return <Bar options={options} data={data} />;
};
