import React from 'react';
import './RoomOrderCard.scss';
import HotelIcon from '@mui/icons-material/Hotel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

function RoomOrderCard({ room, idOrderList }) {
    const history = useHistory();
    const roomOrderList = useSelector((state) => state.order);
    
    const orderList = roomOrderList?.RoomOrderList.filter((item) => item.data && JSON.parse(item.data)[0]?.room_id === +room.id);

    const order = orderList?.find((item) => idOrderList.includes(item.id));



    const handleClick = () => {
        if(order?.in_reality || order?.in_expected) {
            
            history.push(`/order-manager/${order.id}`);
        } else {
            history.push(`/order-manager/create`);
        }
    };
    

    return (
        <>
            <div className={`roomCard ${order?.in_reality ? 'bg-red' : (order?.in_expected ? 'bg-orange' : 'bg-green')}`} onClick={() => handleClick()}>
                <Typography style={{ color: 'white' }} className="roomCard__type">
                    {room.name}
                </Typography>
                <Typography style={{ color: 'white' }} className="roomCard__id">
                    {room.id}
                </Typography>
                <Typography style={{ color: 'white' }} className="roomCard__status">
                {order?.in_reality ? <CheckCircleIcon/> : (order?.in_expected ? <BookmarkBorderIcon /> : <HotelIcon/>)}
                </Typography>
            </div>
        </>
    );
}

export default RoomOrderCard;
