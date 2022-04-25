import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
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
import userApi from '../../../../api/userApi.js';
import { useSnackbar } from 'notistack';

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
    const [user, setUser] = useState();
    const { enqueueSnackbar } = useSnackbar();

    const history = useHistory();
    const {
        params: { userId },
        url,
    } = useRouteMatch();

    const schema = yup.object().shape({
        name: yup.string().required('Please enter your name'),
        email: yup.string().required('Please enter your email').email('Please enter invalid email'),
        phone: yup.string().required('Please enter your phone'),
        location: yup.string().required('Please enter your location'),
        password: yup.string().required('Please enter your password').min(8, 'Please enter at lease 8 characters'),
    });
    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            type: '',
            phone: '',
            location: '',
        },
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        (async () => {
            const user = await userApi.getId({ user: JSON.parse(localStorage.getItem(storageKeys.USER)).user }, userId);
            setUser(user.data.data);
        })();
    }, []);

    const handleSubmit = async (values) => {
        try {
            values.user = JSON.parse(localStorage.getItem(storageKeys.USER)).user;

            const data = await userApi.put(values, userId);
            enqueueSnackbar('Cập nhật thành công', {
                variant: 'success',
            });
            history.push(`/user-manager`);
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
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
                    <InputField form={form} name="name" defaultValues={user?.name} />
                </div>
                <div>
                    <Typography component="h4">Email</Typography>
                    <InputField form={form} name="email" defaultValues={user?.email} />
                </div>
                <div>
                    <Typography component="h4">Password</Typography>
                    <InputField form={form} name="password" />
                </div>
                <div>
                    <Typography component="h4">Type</Typography>
                    <InputField form={form} name="type" defaultValues={user?.type} />
                </div>

                <div>
                    <Typography component="h4">Location</Typography>
                    <InputField form={form} name="location" defaultValues={user?.location} />
                </div>
                <div>
                    <Typography component="h4">Phone</Typography>
                    <InputField form={form} name="phone" defaultValues={user?.phone} />
                </div>

                <Button size="large" type="submit" className={classes.submit} variant="contained" color="primary">
                    Update user
                </Button>
            </form>
        </div>
    );
}

export default UserDetail;
