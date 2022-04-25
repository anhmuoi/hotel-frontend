import React, { useEffect, useMemo, useState } from 'react';
import RoomCard from './components/RoomCard/RoomCard.jsx';
import './RoomList.scss';
import SelectUnstyled, { selectUnstyledClasses } from '@mui/base/SelectUnstyled';
import OptionUnstyled, { optionUnstyledClasses } from '@mui/base/OptionUnstyled';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { styled } from '@mui/system';
import { Box, Button, Pagination, TextField, Typography } from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import RoomDetail from './components/RoomDetail/RoomDetail.jsx';
import RoomApi from '../../api/RoomApi.js';
import RoomManager from '../../components/RoomManager/RoomManager.jsx';
import { getRoomList } from './components/RoomCard/RoomCardSlice.js';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';

function RoomList() {
    const { enqueueSnackbar } = useSnackbar();

    const [roomList, setRoomList] = useState([]);
    const dispatch = useDispatch();

    const [page, setPage] = useState(1);
    const history = useHistory();
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

                setRoomList(resultAction);
                const rs = unwrapResult(resultAction);
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
        <div className="room-list">
            <Button onClick={() => history.push('/room-manager/create')} variant="outlined">
                New+
            </Button>
            <RoomManager />
            <Pagination
                onChange={handlePagination}
                count={pagination.total < 10 ? 1 : Math.ceil(pagination.total / 10)}
                page={pagination.page}
                color="primary"
            />
        </div>
    );
}

export default RoomList;
