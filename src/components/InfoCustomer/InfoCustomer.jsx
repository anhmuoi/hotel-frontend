import { LinearProgress, Typography } from '@mui/material';
import React, { useState } from 'react';
import InputField from '../form-controls/InputField/index.jsx';
import './InfoCustomer.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@material-ui/core';
import orderApi from '../../api/orderApi.js';

function InfoCustomer(props) {
    const [infoList, setInfoList] = useState([]);
    const [moneyTotal, setMoneyTotal] = useState(0);

    const schema = yup.object().shape({
        customer_id: yup.number().required('Mã khách hàng là số'),
    });
    const form = useForm({
        defaultValues: {
            customer_id: '',
            review_customer: '',
        },
        resolver: yupResolver(schema),
    });
    const { formState } = form;
    const handleSubmit = async (values) => {
        try {
            const orderByCustomerId = await orderApi.getOrderListByRoom({
                customer_id: values.customer_id,
            });
            console.log(orderByCustomerId.data);
            setInfoList(orderByCustomerId.data);
            setMoneyTotal(
                orderByCustomerId.data.reduce((total, item) => {
                    return Number(total + Number(item.total_price));
                }, 0)
            );
        } catch (error) {}
    };
    return (
        <div>
            {formState.isSubmitting && <LinearProgress />}
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="enter_info">
                    <Typography component="h4">Enter Customer_Id</Typography>
                    <InputField form={form} name="customer_id" placeholder="customer_id" />
                </div>
                <Button size="large" type="submit" fullWidth variant="contained" color="primary">
                    Search
                </Button>
            </form>
            {infoList.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <Typography>Số lần đặt phòng: {infoList.length}</Typography>
                    <Typography>Tên khách hàng: {infoList[0]?.customer}</Typography>
                    <Typography>SĐT: {infoList[0]?.phone_customer}</Typography>
                    <Typography>Tổng tiền đã chi: {moneyTotal}VNĐ</Typography>
                    <Typography>mức giảm giá order trong hôm nay: -{Math.floor(Math.random() * 15)}%</Typography>
                    <Typography>đánh giá của khách hàng: {infoList[0]?.review_customer || '(không có)'}</Typography>
                </div>
            )}
        </div>
    );
}

export default InfoCustomer;
