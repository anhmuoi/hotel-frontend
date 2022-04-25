import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@material-ui/core';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import * as yup from 'yup';
import RoomOrderCard from '../../features/RoomOrderList/components/RoomOrderCard/RoomOrderCard.jsx';
import { getRoomOrderList } from '../../features/RoomOrderList/components/RoomOrderCard/RoomOrderSlice.js';
import { formatDate } from '../../Utils/common.js';
import DateField from '../form-controls/DateField/index.jsx';
import './DashBoard.scss';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { Pagination } from '@mui/material';
import { useSnackbar } from 'notistack';
import { getRoomList } from '../../features/RoomList/components/RoomCard/RoomCardSlice.js';
import { unwrapResult } from '@reduxjs/toolkit';


function DashBoard({ idOrderRender }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [roomList, setRoomList] = useState([]);



    const location = useLocation();

    const queryParams = useMemo(() => {
        const params = queryString.parse(location.search);

        return {
            ...params,
            page: Number.parseInt(params.page) || 1,
            limit: Number.parseInt(params.limit) || 10,
        };
    }, [location.search]);
    const [pagination, setPagination] = useState({
        page: 1,
        total: 10,
    });

    
    const handlePagination = (event, page) => {
        const filter = {
            ...queryParams,
            page: page,
        };

        history.push({
            pathname: history.location.pathname,
            search: queryString.stringify(filter),
        });
    };

    useEffect(() => {
        (async () => {
            try {
                const action = getRoomList(queryParams);
                const resultAction = await dispatch(action);

                const rs = unwrapResult(resultAction);
                setRoomList(rs.data);
                setPagination({
                    page: rs.pagination.page,
                    total: rs.total,
                });
            } catch (error) {
                enqueueSnackbar(error.message, { variant: 'error' });
            }
        })();
    }, [queryParams]);

    return (
        <div className="dashboard">
            <div className="note">
                <div className="note-1">
                    <div></div>
                    <p>phòng chưa được order</p>
                </div>

                <div className="note-3">
                    <div></div>
                    <p>phòng có order trước hoặc đang được sử dụng</p>
                </div>
            </div>
                <p>click vào room để order</p>
            

            <div className="dashboard-list">
                {roomList.length > 0 && roomList?.map((room, index) => (
                    <RoomOrderCard idOrderList={idOrderRender} room={room} key={index}></RoomOrderCard>
                ))}
            </div>
            <br />
            <Pagination
                onChange={handlePagination}
                count={pagination.total < 10 ? 1 : Math.ceil(pagination.total / 10)}
                page={pagination.page}
                color="primary"
            />
        </div>
    );
}

export default DashBoard;
