import { yupResolver } from '@hookform/resolvers/yup';
import { LinearProgress, makeStyles, Typography } from '@material-ui/core';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, IconButton } from '@mui/material';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouteMatch, useHistory } from 'react-router-dom';
import * as yup from 'yup';
import InputField from '../../../../components/form-controls/InputField/index.jsx';
import { useSelector } from 'react-redux';
import './RoomCreate.scss';
import RoomApi from '../../../../api/RoomApi.js';
import storageKeys from '../../../../constants/storage-key.js';
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

function RoomCreate(props) {
    const { enqueueSnackbar } = useSnackbar();
    const [depreciationCount, setDepreciationCount] = React.useState([1]);
    const [dataCount, setDataCount] = React.useState([1]);


    const history = useHistory();

    const schema = yup.object().shape({
        name: yup.string().required('Tên phòng không được để trống'),
        fixed_price: yup.number().required('Giá phòng không được để trống'),
        investment_price: yup.number().required('Giá đầu tư không được để trống'),
        location: yup.string().required('Vị trí phòng không được để trống'),
    });
    const form = useForm({
        defaultValues: {
            name: '',
            location: '',
            fixed_price: '',
            investment_price: '',
        },
        resolver: yupResolver(schema),
    });

    const handleSubmit = async (values) => {
        try {
            const depreciation_period = [];
            depreciationCount.map((item, index) => {
                depreciation_period.push({ info: values[`date${index + 1}`], price: values[`price${index + 1}`] });
                delete values[`price${index + 1}`];
                delete values[`date${index + 1}`];
            });
            values.depreciation_period =JSON.stringify(depreciation_period);

            values.data = [];
            values.user = JSON.parse(localStorage.getItem(storageKeys.USER)).user;

            const valuesOptimal = Object.keys(values).filter((key) => values[key] !== undefined);
            const value_obj = {};
            valuesOptimal.forEach((key) => (value_obj[key] = values[key]));

            const data = await RoomApi.create(value_obj);
            enqueueSnackbar('create success!', { variant: 'success' });
            history.push('/room-manager');
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    const classes = useStyles();

    const { formState } = form;

    // useEffect(() => {
    //     if (roomList.RoomList.length === 0) {
    //         history.push('/room-manager');
    //     }
    // }, []);

    return (
        <div className="room-create">
            {formState.isSubmitting && <LinearProgress />}
            <Typography className={classes.title} component="h1" variant="h5">
                create room
            </Typography>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="room-create-name">
                    <Typography component="h4">Name</Typography>
                    <InputField form={form} name="name" placeholder="name" />
                </div>
                <div className="room-create-location">
                    <Typography component="h4">Location</Typography>
                    <InputField form={form} name="location" placeholder="location" />
                </div>

                <div className="room-create-fix">
                    <Typography component="h4">fixed_price</Typography>
                    <InputField form={form} name="fixed_price" placeholder="fixed_price" />
                </div>
                <div className="room-create-invest">
                    <Typography component="h4">investment_price</Typography>
                    <InputField form={form} name="investment_price" placeholder="investment_price" />
                </div>

                <div className="room-create-dep">
                    <div className="room-create-dep-icon">
                        <Typography component="h4">depreciation_period</Typography>
                        <IconButton onClick={() => setDepreciationCount([...depreciationCount, depreciationCount.length + 1])}>
                            <AddBoxIcon />
                        </IconButton>
                        <IconButton onClick={() => setDepreciationCount((prev) => prev.filter((_, i) => i !== prev.length - 1))}>
                            <RemoveIcon />
                        </IconButton>
                    </div>
                    {depreciationCount.map((item, index) => (
                        <div className="room-detail-dep-form" key={index}>
                            <InputField form={form} name={`date${item}`} placeholder="date: example: 2022/04/12 08:35:17" />
                            <InputField form={form} name={`price${item}`} placeholder="price" />
                        </div>
                    ))}
                </div>

                <Button size="large" type="submit" className={classes.submit} fullWidth variant="contained" color="primary">
                    Create
                </Button>
            </form>
        </div>
    );
}

export default RoomCreate;
