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
import './RoomDetail.scss';
import RoomApi from '../../../../api/RoomApi.js';
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

function RoomDetail(props) {
    const { onSubmit } = props;
    const roomList = useSelector((state) => state.room);
    const [depreciationCount, setDepreciationCount] = React.useState([1]);
    const [dataCount, setDataCount] = React.useState([1]);

    const {
        params: { roomId },
        url,
    } = useRouteMatch();
    const history = useHistory();
    const room = roomList.RoomList.find((room) => Number(room.id) === +roomId);

    const schema = yup.object().shape({
        name: yup.string().required('Tên phòng không được để trống'),
        description: yup.string().required('Mô tả phòng không được để trống'),
        fixed_price: yup.number().required('Giá phòng không được để trống'),
        investment_price: yup.number().required('Giá đầu tư không được để trống'),
        location: yup.string().required('Vị trí phòng không được để trống'),
    });
    const form = useForm({
        defaultValues: {
            name: room?.name,
            location: room?.location,
            fixed_price: room?.fixed_price,
            investment_price: room?.investment_price ? JSON.parse(room?.investment_price) : ' ',
            data: room?.data,
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
            delete values['date'];
            values.depreciation_period = depreciation_period;

            const newData = [];
            dataCount.map((item, index) => {
                newData.push({ data: values[`data${index + 1}`], value: values[`value${index + 1}`] });
                delete values[`data${index + 1}`];
                delete values[`value${index + 1}`];
            });
            delete values['date'];
            values.data = newData;

            values.user = JSON.parse(localStorage.getItem(storageKeys.USER)).user;
            console.log(values);

            const data = await RoomApi.put(values, roomId);
            history.push('/room-manager');
        } catch (error) {
            console.log(error);
        }
    };

    const classes = useStyles();

    const { formState } = form;

    useEffect(() => {
        if (roomList.RoomList.length === 0) {
            history.push('/room-manager');
        }
    }, []);

    return (
        <div className="room-detail">
            {formState.isSubmitting && <LinearProgress />}
            <Typography className={classes.title} component="h1" variant="h5">
                phòng {roomId}
            </Typography>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="room-detail-name">
                    <Typography component="h4">Name</Typography>
                    <InputField form={form} name="name" placeholder="name" />
                </div>
                <div className="room-detail-location">
                    <Typography component="h4">Location</Typography>
                    <InputField form={form} name="location" placeholder="location" />
                </div>

                <div className="room-detail-fix">
                    <Typography component="h4">fixed_price</Typography>
                    <InputField form={form} name="fixed_price" placeholder="fixed_price" />
                </div>
                <div className="room-detail-invest">
                    <Typography component="h4">investment_price</Typography>
                    <InputField form={form} name="investment_price" placeholder="investment_price" />
                </div>
                <div className="room-detail-dep">
                    <div className="room-detail-dep-icon">
                        <Typography component="h4">data</Typography>
                        <IconButton onClick={() => setDataCount([...dataCount, dataCount.length + 1])}>
                            <AddBoxIcon />
                        </IconButton>
                        <IconButton onClick={() => setDataCount(dataCount.splice(-1))}>
                            <RemoveIcon />
                        </IconButton>
                    </div>
                    {dataCount.map((item, index) => (
                        <div className="room-detail-dep-form" key={index}>
                            <InputField form={form} name={`data${item}`} placeholder="new data" />
                            <InputField form={form} name={`value${item}`} placeholder="value" />
                        </div>
                    ))}
                </div>
                <div className="room-detail-dep">
                    <div className="room-detail-dep-icon">
                        <Typography component="h4">depreciation_period</Typography>
                        <IconButton onClick={() => setDepreciationCount([...depreciationCount, depreciationCount.length + 1])}>
                            <AddBoxIcon />
                        </IconButton>
                        <IconButton onClick={() => setDepreciationCount(depreciationCount.splice(-1))}>
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
                    update
                </Button>
            </form>
        </div>
    );
}

export default RoomDetail;
