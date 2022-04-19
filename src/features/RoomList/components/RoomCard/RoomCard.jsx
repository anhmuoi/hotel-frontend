import React from 'react';
import './RoomCard.scss';
import HotelIcon from '@mui/icons-material/Hotel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Typography } from '@mui/material';
import RoomDetail from '../RoomDetail/RoomDetail.jsx';
import { useHistory } from 'react-router-dom';

function RoomCard({ room }) {
    const history = useHistory();
    const handleClick = () => {
        history.push(`/order-manager/${room.id}`);
    };
    return (
        <>
            <div className={`roomCard ${room.status === 'free' ? 'bg-green' : 'bg-red'}`} onClick={() => handleClick()}>
                <Typography style={{ color: 'white' }} className="roomCard__type">
                    {room.type}
                </Typography>
                <Typography style={{ color: 'white' }} className="roomCard__id">
                    {room.id}
                </Typography>
                <Typography style={{ color: 'white' }} className="roomCard__status">
                    {room.status === 'free' ? <CheckCircleIcon /> : <HotelIcon />}
                </Typography>
            </div>
        </>
    );
}

export default RoomCard;
