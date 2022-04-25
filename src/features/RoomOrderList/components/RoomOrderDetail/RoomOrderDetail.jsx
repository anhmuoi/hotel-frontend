import { yupResolver } from '@hookform/resolvers/yup';
import { LinearProgress, makeStyles, Typography } from '@material-ui/core';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import * as yup from 'yup';
import orderApi from '../../../../api/orderApi.js';
import DateTimeField from '../../../../components/form-controls/DateTimeField/index.jsx';
import InputField from '../../../../components/form-controls/InputField/index.jsx';
import SelectField from '../../../../components/form-controls/SelectField/index.jsx';
import storageKeys from '../../../../constants/storage-key.js';
import { compareTime } from '../../../../Utils/common.js';
import './RoomOrderDetail.scss';

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

const kenhList = ['Online', 'Sale'];

function RoomOrderDetail(props) {
    const { enqueueSnackbar } = useSnackbar();

    const roomOrderList = useSelector((state) => state.order);

    const history = useHistory();
    const {
        params: { roomOrderId },
        url,
    } = useRouteMatch();

    const order = roomOrderList?.RoomOrderList.find((order) => order.id === +roomOrderId);
    if (!order) {
        history.push('/order-manager');
    }

    const [additionalCount, setadditionalCount] = React.useState([1]);

    const schema = yup.object().shape({
        room_id: yup.number().required('Vui lòng chọn phòng'),
        customer: yup.string().required('Tên không được để trống'),
        sale: yup.string().required('Nhân viên không được để trống'),
        phone_customer: yup.number().required('Số điện thoại không được để trống'),
        type_booking: yup.string().required('kiểu thuê không được để trống'),
        type: yup.number().required('price/hour không được để trống'),
        in_expected: yup.string().required('Thời gian dự kiến không được để trống'),
        out_expected: yup.string().required('Thời gian dự kiến không được để trống'),
        // in_reality: yup.string(),
        // out_reality: yup.string(),
    });
    const form = useForm({
        defaultValues: {
            room_id: order?.room_id,
            customer: order?.customer,
            sale: order?.sale,
            phone_customer: order?.phone_customer,
            type: order?.type,
            type_booking: kenhList[kenhList.indexOf(order?.type_booking)] || '',
            in_expected: order?.in_expected,
            out_expected: order?.out_expected,
            in_reality: order?.in_reality,
            out_reality: order?.out_reality,
        },
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (JSON.parse(order?.additional_price)[0]?.info !== null) {
            setadditionalCount(() => {
                const newCount = [];
                for (let i = 0; i < JSON.parse(order?.additional_price).length; i++) {
                    newCount.push(i + 1);
                }
                return newCount;
            });
        }
    }, []);

    const handleClickRemoveAdditional = () => {
        setadditionalCount((prev) => prev.filter((_, i) => i !== prev.length - 1));
    };

    const handleSubmit = async (values) => {
        try {
            const additional_price = [];
            let total_price = 0;
            additionalCount.map((item, index) => {
                additional_price.push({ info: values[`add_price${index + 1}`], price: values[`price${index + 1}`] });
                values[`price${index + 1}`] ? (total_price += Number(values[`price${index + 1}`])) : (total_price += 0);
                delete values[`price${index + 1}`];
                delete values[`add_price${index + 1}`];
            });
            // delete values['date'];
            values.additional_price = additional_price;
            values.user = JSON.parse(localStorage.getItem(storageKeys.USER)).user;
            if (values.in_reality && values.out_reality) {
                // return number of hour
                const diff = Math.abs(new Date(values.out_reality) - new Date(values.in_reality));
                const hours = Math.floor(diff / 36e5);
                total_price += hours * values.type;
            } else if (values.in_expected && values.out_expected) {
                const diff = Math.abs(new Date(values.out_expected) - new Date(values.in_expected));
                const hours = Math.floor(diff / 36e5);
                total_price += hours * Number(values.type);
            }
            values.total_price = total_price;

            const data = [];
            // data.push({ room_id: values['room_id'] });
            values.data = data;

            try {
                if (values.room_id) {
                    const roomIndex = await orderApi.getAll({ room_id: values.room_id });
                    if (roomIndex.data === null) {
                        enqueueSnackbar('phòng không tồn tại', { variant: 'error' });
                    } else {
                        let temp = true;

                        roomIndex.data.map((item) => {
                            if (item.id !== +roomOrderId && new Date(item.out_expected) >= new Date()) {
                                if (
                                    compareTime(new Date(item.in_expected), new Date(item.out_expected), values.in_expected) ||
                                    compareTime(new Date(item.in_expected), new Date(item.out_expected), values.out_expected) ||
                                    compareTime(new Date(values.in_expected), new Date(values.out_expected), new Date(item.in_expected)) ||
                                    compareTime(new Date(values.in_expected), new Date(values.out_expected), new Date(item.out_expected))
                                ) {
                                    temp = false;
                                }
                            }
                        });

                        if (temp === true) {
                            const valuesOptimal = Object.keys(values).filter((key) => values[key] !== undefined);
                            const value_obj = {};
                            valuesOptimal.forEach((key) => (value_obj[key] = values[key]));
                            const result = await orderApi.update(value_obj, roomOrderId);
                            enqueueSnackbar('update success!', { variant: 'success' });
                            history.push('/order-manager');
                        } else {
                            enqueueSnackbar('Thời gian đặt phòng bị trùng', { variant: 'error' });
                        }
                    }
                }
            } catch (error) {}
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
                order {roomOrderId}
            </Typography>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="room-detail-idroom">
                    <Typography component="h4">số phòng</Typography>
                    <InputField form={form} name="room_id" label="số phòng" />
                </div>
                <div className="room-detail-name-customer">
                    <Typography component="h4">Tên Khách Hàng</Typography>
                    <InputField form={form} name="customer" label="tên khách hàng" />
                </div>
                <div>
                    <Typography component="h4">Tên Nhân viên bán hàng</Typography>
                    <InputField form={form} name="sale" label="tên nhân viên" />
                </div>
                <div>
                    <Typography component="h4">Số ĐT Khách hàng</Typography>
                    <InputField form={form} name="phone_customer" label="SĐT" />
                </div>
                <div>
                    <Typography component="h4">Kiểu thuê </Typography>
                    <InputField form={form} name="type" label="price/hour" />
                </div>

                <div>
                    <Typography component="h4">giờ vào dự kiến</Typography>
                    <DateTimeField form={form} name="in_expected" label="giờ vào dự kiến" />
                </div>
                <div>
                    <Typography component="h4">Giờ ra dự kiến</Typography>
                    <DateTimeField form={form} name="out_expected" label="giờ ra dự kiến" />
                </div>
                <div>
                    <Typography component="h4">Giờ vào thực tế </Typography>
                    <DateTimeField form={form} name="in_reality" label="giờ vào thực tế" />
                </div>
                <div>
                    <Typography component="h4">Giờ ra thực tế </Typography>
                    <DateTimeField form={form} name="out_reality" label="giờ ra thực tế" />
                </div>
                <div className="order-detail-dep">
                    <div className="room-detail-dep-icon">
                        <Typography component="h4">Giá phụ thu dịch vụ </Typography>
                        <IconButton onClick={() => setadditionalCount([...additionalCount, additionalCount.length + 1])}>
                            <AddBoxIcon />
                        </IconButton>
                        <IconButton onClick={() => handleClickRemoveAdditional()}>
                            <RemoveIcon />
                        </IconButton>
                    </div>
                    {additionalCount.map((item, index) => (
                        <div className="room-detail-dep-form" key={index}>
                            <InputField
                                form={form}
                                name={`add_price${item}`}
                                defaultValues={JSON.parse(order?.additional_price)[index]?.info}
                                placeholder="info"
                            />
                            <InputField
                                form={form}
                                name={`price${item}`}
                                placeholder="price"
                                defaultValues={JSON.parse(order?.additional_price)[index]?.price}
                            />
                        </div>
                    ))}
                </div>

                <div>
                    <Typography component="h4">Khách đặt qua kênh nào </Typography>
                    <SelectField selectList={kenhList} form={form} name="type_booking" />
                </div>

                <Button size="large" type="submit" className={classes.submit} variant="contained" color="primary">
                    Update order
                </Button>
            </form>
        </div>
    );
}

export default RoomOrderDetail;
