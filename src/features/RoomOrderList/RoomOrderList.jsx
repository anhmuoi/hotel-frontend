import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Pagination } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
import queryString from 'query-string';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import orderApi from '../../api/orderApi.js';
import DashBoard from '../../components/DashBoard/DashBoard.jsx';
import DateField from '../../components/form-controls/DateField/index.jsx';
import OrderManager from '../../components/OrderManager/OrderManager.jsx';
import storageKeys from '../../constants/storage-key.js';
import { formatDate, formatPrice } from '../../Utils/common.js';
import useClock from '../../Utils/useLock.jsx';
import { getRoomList } from '../RoomList/components/RoomCard/RoomCardSlice.js';
import { getRoomOrderList } from './components/RoomOrderCard/RoomOrderSlice.js';
import './RoomOrderList.scss';




function RoomOrderList() {
    const dispatch = useDispatch();
    const roomList = useSelector((state) => state.room.RoomList);
    const [roomRender, setRoomRender] = useState(roomList ? roomList : []);
    const [idOrderRender, setIdOrderRender] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const location = useLocation();
    const history = useHistory();
    const timeString = useClock();
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPriceRender, setTotalPriceRender] = useState(0);

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

    const handleGetListRoom = async () => {
        const action = getRoomList({ page: pagination.page });
        const resultAction = await dispatch(action);
        setRoomRender(unwrapResult(resultAction).data);

    };
    if (roomRender?.length === 0) {
        handleGetListRoom();
    }

    useEffect(() => {
        (async () => {
            try {
                try {
                    const totalPrice = await orderApi.getTotalPrice({ user: JSON.parse(localStorage.getItem(storageKeys.USER)).user });
                    setTotalPrice(totalPrice.data.total_price);
                } catch (error) {
                    enqueueSnackbar(error.message, { variant: 'error' });
                }

                const action = getRoomOrderList(queryParams);
                const resultAction = await dispatch(action);

                const rs = unwrapResult(resultAction);
                

                // use reduce to get total price
                const totalPriceRender = rs.data.reduce((total, item) => {
                    return total + Number(item.total_price);
                }, 0);
                setTotalPriceRender(totalPriceRender);


                setPagination({
                    page: rs.pagination.page,
                    total: rs.total,
                });

                if (roomRender.length !== 0 && rs) {
                    roomRender.map((room, index) => {
                        rs?.data.map((roomOrder, indexOrder) => {
                            if (room.id === roomOrder?.room_id) {
                                if (roomOrder.in_reality && roomOrder.out_reality) {
                                    if (
                                        new Date(roomOrder.in_reality).getTime() < new Date(timeString).getTime() &&
                                        new Date(roomOrder.out_reality).getTime() >= new Date(timeString).getTime()
                                    ) {
                                        setIdOrderRender((prev) => (prev.includes(roomOrder.id) ? prev : [...prev, roomOrder.id]));
                                    }
                                } else if (roomOrder.in_reality && roomOrder.in_expected && roomOrder.out_reality !== null) {
                                    if (
                                        new Date(roomOrder.in_reality).getTime() <= new Date(timeString).getTime() &&
                                        new Date(roomOrder.in_expected).getTime() <= new Date(timeString).getTime()
                                    ) {
                                        setIdOrderRender((prev) => (prev.includes(roomOrder.id) ? prev : [...prev, roomOrder.id]));
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
                enqueueSnackbar(error.message, { variant: 'error' });
            }
        })();
    }, [roomRender, timeString === undefined, queryParams]);

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

    const schema = yup.object().shape({});
    const form = useForm({
        defaultValues: {
            date_from: null,
            date_to: null,
        },
        resolver: yupResolver(schema),
    });

    const handleSubmit = async (values) => {
        try {
            const filter = {
                ...queryParams,
                time_start: formatDate(values.date_from),
                time_end: formatDate(values.date_to),
            };

            history.push({
                pathname: history.location.pathname,
                search: queryString.stringify(filter),
            });
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    const { formState } = form;

    if (!roomRender) {
        return <div>Loading...</div>;
    }
    return (
        <div className="order-list">
            <div className="order-list__search"></div>
            <div className="order-list__date"></div>
            {location.pathname === '/order-manager' ? (
                <>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="dashboard-search">
                        <div className="dashboard-date">
                            <DateField name="date_from" form={form} label="from" />
                            <DateField name="date_to" form={form} label="to" />
                        </div>
                        <Button size="large" type="submit" variant="contained" color="primary">
                            search
                        </Button>
                    </form>
                    <div className="order-list-form">
                        <div className="order-list-money">
                            <p>tổng doanh thu:&nbsp;</p>
                            <h4> {formatPrice(totalPrice)}</h4>
                        </div>
                        <div className="order-list-current-money">
                            <p>tổng doanh thu những order trong danh sách bên dưới:&nbsp;</p>
                            <h4 style={{fontWeight: 'bold'}}>{formatPrice(totalPriceRender)}</h4>
                        </div>
                    </div>
                    <OrderManager />
                    <Pagination onChange={handlePagination} count={Math.ceil(pagination.total / 10)} page={pagination.page} color="primary" />
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
