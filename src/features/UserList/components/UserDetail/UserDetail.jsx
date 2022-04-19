import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import './UserDetail.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LinearProgress, makeStyles, Typography } from '@material-ui/core';
import InputField from '../../../../components/form-controls/InputField/index.jsx';
import CheckBoxField from '../../../../components/form-controls/CheckBoxField/index.jsx';
import SelectField from '../../../../components/form-controls/SelectField/index.jsx';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import orderApi from '../../../../api/orderApi.js';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveIcon from '@mui/icons-material/Remove';
import storageKeys from '../../../../constants/storage-key.js';

const useStyles = makeStyles((theme) => ({
    avatar: {
        backgroundColor: theme.palette.secondary.main,
        margin: '0 auto',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        color: 'white',
        backgroundColor: '#1890FF',
    },
    title: {
        textAlign: 'center',
        color: '#1890FF',
    },
}));

const selectList = ['giờ', 'ngày', 'tháng'];
const selectorderList = [
    {
        type: 'giờ',
        value: 100000,
    },
    {
        type: 'ngày',
        value: 2000,
    },
    {
        type: 'tháng',
        value: 3000,
    },
];
const kenhList = ['online', 'sale'];

function UserDetail(props) {
    const user = useSelector((state) => state.user);
    const [additionalCount, setadditionalCount] = React.useState([1]);

    const roomOrderList = useSelector((state) => state.order);

    const history = useHistory();
    const {
        params: { userId },
        url,
    } = useRouteMatch();

    const order = roomOrderList?.RoomOrderList.find((room) => room.data && JSON.parse(room.data)[0]?.room_id === +userId);

    const schema = yup.object().shape({});
    const form = useForm({
        defaultValues: {
            nameuser: order?.customer,
            email: order?.sale,
            type: order?.phone_customer,
      
        },
        resolver: yupResolver(schema),
    });

    const handleSubmit = async (values) => {
        try {
            const additional_price = [];
            additionalCount.map((item, index) => {
                additional_price.push({ info: values[`info${index + 1}`], price: values[`value${index + 1}`] });
                delete values[`value${index + 1}`];
                delete values[`info${index + 1}`];
            });
            // delete values['date'];
            values.data = additional_price;
            values.user = JSON.parse(localStorage.getItem(storageKeys.USER)).user;

            console.log(values);
            const data = await orderApi.put(values, userId);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    const classes = useStyles();

    const { formState } = form;

    return (
        <div className="room-detail">
            {formState.isSubmitting && <LinearProgress />}
            <Typography className={classes.title} component="h1" variant="h5">
                userID: {userId}
            </Typography>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="room-detail-name-customer">
                    <Typography component="h4">Name User</Typography>
                    <InputField form={form} name="nameuser" label="name user" />
                </div>
                <div>
                    <Typography component="h4">Email</Typography>
                    <InputField form={form} name="email" label="email" />
                </div>
                <div>
                    <Typography component="h4">Type</Typography>
                    <InputField form={form} name="type" label="SĐT" />
                </div>

                <div>
                    <Typography component="h4">Location</Typography>
                    <InputField form={form} name="location" label="location" />
                </div>
                <div>
                    <Typography component="h4">Phone</Typography>
                    <InputField form={form} name="phone" label="phone" />
                </div>

                <div className="order-detail-dep">
                    <div className="room-detail-dep-icon">
                        <Typography component="h4">data</Typography>
                        <IconButton onClick={() => setadditionalCount([...additionalCount, additionalCount.length + 1])}>
                            <AddBoxIcon />
                        </IconButton>
                        <IconButton onClick={() => setadditionalCount(additionalCount.splice(-1))}>
                            <RemoveIcon />
                        </IconButton>
                    </div>
                    {additionalCount.map((item, index) => (
                        <div className="room-detail-dep-form" key={index}>
                            <InputField form={form} name={`info${item}`} placeholder="info" />
                            <InputField form={form} name={`value${item}`} placeholder="value" />
                        </div>
                    ))}
                </div>

                <Button size="large" type="submit" className={classes.submit} variant="contained" color="primary">
                    Update user
                </Button>
            </form>
        </div>
    );
}

export default UserDetail;
