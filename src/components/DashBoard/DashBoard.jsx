import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@material-ui/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import RoomOrderCard from '../../features/RoomOrderList/components/RoomOrderCard/RoomOrderCard.jsx';
import { getRoomOrderList } from '../../features/RoomOrderList/components/RoomOrderCard/RoomOrderSlice.js';
import { formatDate } from '../../Utils/common.js';
import DateField from '../form-controls/DateField/index.jsx';
import './DashBoard.scss';

function DashBoard({ roomList, idOrderRender }) {
    const dispatch = useDispatch();
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
            console.log(formatDate(values.date_to), formatDate(values.date_from));
            const action = getRoomOrderList({ time_start: formatDate(values.date_from), time_end: formatDate(values.date_to) });
            const resultAction = await dispatch(action);
            console.log(resultAction);
        } catch (error) {
            console.log(error);
        }
    };

    const { formState } = form;

    return (
        <div className="dashboard">
            <form onSubmit={form.handleSubmit(handleSubmit)} className="dashboard-search">
                <div className="dashboard-date">
                    <DateField name="date_from" form={form} label="from" />
                    <DateField name="date_to" form={form} label="to" />
                </div>
                <Button size="large" type="submit" variant="contained" color="primary">
                    search
                </Button>
            </form>
            <div className="dashboard-list">
                {roomList?.map((room, index) => (
                    <RoomOrderCard idOrderList={idOrderRender} room={room} key={index}></RoomOrderCard>
                ))}
            </div>
        </div>
    );
}

export default DashBoard;
