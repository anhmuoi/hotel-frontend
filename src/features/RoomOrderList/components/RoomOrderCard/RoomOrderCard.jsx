import React, { useEffect } from 'react';
import './RoomOrderCard.scss';
import HotelIcon from '@mui/icons-material/Hotel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import orderApi from '../../../../api/orderApi.js';
import useClock from '../../../../Utils/useLock.jsx';
import { formatDate } from '../../../../Utils/common.js';

function RoomOrderCard({ room, idOrderList }) {
    const history = useHistory();
    const [orderListByRoom, setOrderListByRoom] = React.useState();
    const timeString = useClock();

    useEffect(() => {
        (async () => {
            if (room.id) {
                const orderByRoom = await orderApi.getOrderListByRoom({
                    room_id: room.id,
                });
                const orderList = orderByRoom.data.data;

                if (orderList) {
                    orderList.map((order, index) => {
                        if (order.in_reality && order.out_reality) {
                            if (
                                new Date(order.in_reality).getTime() < new Date(timeString).getTime() &&
                                new Date(order.out_reality).getTime() >= new Date(timeString).getTime()
                            ) {
                                orderList[index].status = 'running';
                            }
                        } else if (order.in_reality && order.out_expected && order.out_reality !== null) {
                            if (
                                new Date(order.in_reality).getTime() <= new Date(timeString).getTime() &&
                                new Date(order.out_expected).getTime() <= new Date(timeString).getTime()
                            ) {
                                orderList[index].status = 'running';
                            }
                        } else if (order.in_expected && order.out_expected) {
                            if (
                                new Date(order.in_expected).getTime() >= new Date(timeString).getTime() &&
                                new Date(order.out_expected).getTime() >= new Date(timeString).getTime()
                            ) {
                                orderList[index].status = 'booked';
                            } else {
                                orderList.splice(index, 1);
                            }
                        }
                    });
                }
                setOrderListByRoom(orderList);
            }
        })();
    }, [timeString === undefined]);

    const handleClick = () => {
        history.push(`/dashboard/${room.id}`);
    };

    return (
        <>
            <div className={`roomCard ${orderListByRoom?.length === 0 ? 'bg-green' : 'bg-red'}`} onClick={() => handleClick()}>
                <Typography style={{ color: 'white', textAlign: 'center' }} className="roomCard__type">
                    {room.name}
                </Typography>
                <Typography style={{ color: 'white' }} className="roomCard__id">
                    {room.id}
                </Typography>
                <Typography style={{ color: 'white' }} className="roomCard__status">
                    {orderListByRoom?.length === 0 ? <HotelIcon /> : <CheckCircleIcon />}
                </Typography>
            </div>
        </>
    );
}

export default RoomOrderCard;
