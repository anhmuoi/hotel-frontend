import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import orderApi from '../../api/orderApi.js';
import './lineChart.css';

function LineChart() {
    const [RoomOrderList, setRoomOrderList] = useState([]);
    const numberOrder = [];
    const orderTimestamp = [];

    for (let i = 0; i < RoomOrderList.length - 1; i++) {
        if (RoomOrderList[i].createdAt === RoomOrderList[i + 1].createdAt) {
            const count = RoomOrderList.filter((roomOrder) => roomOrder.createdAt === RoomOrderList[i].createdAt);

            numberOrder.push(count.length);
            orderTimestamp.push(new Date(RoomOrderList[i].createdAt).toLocaleDateString());
        } else {
            numberOrder.push(1);
            orderTimestamp.push(new Date(RoomOrderList[i].createdAt).toLocaleDateString());
        }
    }

    const data = {
        labels: orderTimestamp,
        datasets: [
            {
                label: 'số order',
                title: 'Order',
                data: numberOrder,
                fill: false,
                backgroundColor: '#0071bd',
            },
        ],
    };

    const option = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                    },
                },
            ],
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'biểu đồ số lượng order theo thời gian',
            },
        },
    };

    useEffect(() => {
        (async () => {
            try {
                const orderList = await orderApi.getAllOrder();

                setRoomOrderList(orderList.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <>
            <Line data={data} options={option}></Line>
        </>
    );
}

export default LineChart;
