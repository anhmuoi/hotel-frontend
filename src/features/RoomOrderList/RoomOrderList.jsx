import React, { useEffect, useState } from 'react';
import './RoomOrderList.scss';
import SelectUnstyled, { selectUnstyledClasses } from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { styled } from '@mui/system';
import { Box, Button, Pagination, TextField, Typography } from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import RoomApi from '../../api/RoomApi.js';
import RoomManager from '../../components/RoomManager/RoomManager.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { getRoomOrderList } from './components/RoomOrderCard/RoomOrderSlice.js';
import UserManager from '../../components/UserManager/UserManager.jsx';
import RoomOrderCard from './components/RoomOrderCard/RoomOrderCard.jsx';
import { getRoomList } from '../RoomList/components/RoomCard/RoomCardSlice.js';
import { unwrapResult } from '@reduxjs/toolkit';
import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import OrderManager from '../../components/OrderManager/OrderManager.jsx';
import DashBoard from '../../components/DashBoard/DashBoard.jsx';
import useClock from '../../Utils/useLock.jsx';

function RoomOrderList() {
    const dispatch = useDispatch();
    const roomList = useSelector((state) => state.room.RoomList);
    const [roomRender, setRoomRender] = useState(roomList ? roomList : []);
    const [idOrderRender, setIdOrderRender] = useState([]);
    const [page, setPage] = useState(1);
    const location = useLocation();
    const history = useHistory();
    const timeString = useClock();

    const handleGetListRoom = async () => {
        const action = getRoomList({ page: 1, limit: 10 });
        const resultAction = await dispatch(action);
        setRoomRender(unwrapResult(resultAction).data);
    };
    if (roomRender?.length === 0) {
        handleGetListRoom();
    }

    useEffect(() => {
        (async () => {
            try {
                const action = getRoomOrderList({ page: 1, limit: 10 });
                const resultAction = await dispatch(action);

                const rs = unwrapResult(resultAction);
                console.log(rs.data);

                if (roomRender.length !== 0 && rs) {
                    roomRender.map((room, index) => {
                        rs?.data.map((roomOrder, indexOrder) => {
                            if (room.id === JSON.parse(roomOrder?.data)[0]?.room_id) {
                                if (roomOrder.in_reality && roomOrder.out_reality) {
                                    console.log(new Date(timeString).getTime());
                                    if (
                                        new Date(roomOrder.in_reality).getTime() < new Date(timeString).getTime() &&
                                        new Date(roomOrder.out_reality).getTime() >= new Date(timeString).getTime()
                                    ) {
                                        setIdOrderRender([...idOrderRender, roomOrder.id]);
                                    }
                                } else if (roomOrder.in_expected && roomOrder.out_expected) {
                                    if (
                                        new Date(roomOrder.in_expected).getTime() >= new Date(timeString).getTime() &&
                                        new Date(roomOrder.out_expected).getTime() >= new Date(timeString).getTime()
                                    ) {
                                        setIdOrderRender((prev) => (prev.includes(roomOrder.id) ? prev : [...prev, roomOrder.id]));
                                    }
                                }
                            }
                        });
                    });
                }
            } catch (error) {
                console.log('fail to fetch  list', error);
            }
        })();
    }, [roomRender, timeString === undefined]);

    const handlePagination = (event, page) => {
        setPage(page);
    };

    if (!roomRender) {
        return <div>Loading...</div>;
    }
    return (
        <div className="order-list">
            <div className="order-list__search"></div>
            <div className="order-list__date"></div>
            {location.pathname === '/order-manager' ? (
                <>
                    <Button onClick={() => history.push('/order-manager/create')} variant="outlined">
                        New+
                    </Button>
                    <OrderManager />
                    <Pagination onChange={handlePagination} count={Math.ceil((page * 10) / 10)} page={page} color="primary" />
                </>
            ) : location.pathname === '/dashboard' ? (
                <div className="order-list__list">
                    <DashBoard idOrderRender={idOrderRender} roomList={roomList} />
                </div>
            ) : null}
            <div>{timeString}</div>
        </div>
    );
}

export default RoomOrderList;
