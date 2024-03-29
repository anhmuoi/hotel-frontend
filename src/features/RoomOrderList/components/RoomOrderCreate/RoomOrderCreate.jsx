import { yupResolver } from '@hookform/resolvers/yup';
import { LinearProgress, makeStyles, Typography } from '@material-ui/core';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveIcon from '@mui/icons-material/Remove';
import { Button, IconButton } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import * as yup from 'yup';
import orderApi from '../../../../api/orderApi.js';
import RoomApi from '../../../../api/RoomApi.js';
import DateTimeField from '../../../../components/form-controls/DateTimeField/index.jsx';
import InputField from '../../../../components/form-controls/InputField/index.jsx';
import SelectField from '../../../../components/form-controls/SelectField/index.jsx';
import storageKeys from '../../../../constants/storage-key.js';
import { compareTime } from '../../../../Utils/common.js';
import './RoomOrderCreate.scss';

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

function RoomOrderCreate(props) {
    const { enqueueSnackbar } = useSnackbar();
    const {
        params: { roomOrderId },
        url,
    } = useRouteMatch();

    const user = useSelector((state) => state.user);
    const [additionalCount, setadditionalCount] = React.useState([1]);
    const history = useHistory();

    const schema = yup.object().shape({
        room_id: yup.number().required('Vui lòng chọn phòng'),
        customer: yup.string().required('Tên không được để trống'),
        customer_id: yup.number().required('id không được để trống'),
        sale: yup.string().required('Nhân viên không được để trống'),
        phone_customer: yup.number().required('Số điện thoại không được để trống'),
        type_booking: yup.string().required('giá thuê không được để trống'),
        type: yup.number().required('price/hour không được để trống'),
        in_expected: yup.string().required('Thời gian dự kiến không được để trống'),
        out_expected: yup.string().required('Thời gian dự kiến không được để trống'),
        discount: yup.string().required("yêu cầu nhập discount")
        // in_reality: yup.string(),
        // out_reality: yup.string(),
    });
    const form = useForm({
        defaultValues: {
            room_id: roomOrderId,
            customer: '',
            customer_id: '',
            sale: '',
            phone_customer: '',
            type: '',
            type_booking: '',
            in_expected: null,
            out_expected: null,
            in_reality: null,
            out_reality: null,
            discount: '0%'
        },
        resolver: yupResolver(schema),
    });

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
            values.total_price = total_price - total_price* (values.discount.split('%')[0]/100);

    

            try {
                if (values.room_id) {
                    const room = await RoomApi.getId(values.room_id);

                    const roomIndex = await orderApi.getAll({ room_id: values.room_id });
                    if (!room.data) {
                        enqueueSnackbar('phòng không tồn tại', { variant: 'error' });
                    } else {
                        let temp = true;

                        roomIndex.data && roomIndex?.data.map((item) => {
                            if (item.id && new Date(item.out_expected) >= new Date()) {
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
                        console.log(temp)
                        if (temp === true) {
                            const valuesOptimal = Object.keys(values).filter((key) => values[key] !== undefined);
                            const value_obj = {};
                            valuesOptimal.forEach((key) => (value_obj[key] = values[key]));

                            const result = await orderApi.create(value_obj);
                            console.log(result);
                            enqueueSnackbar('update success!', { variant: 'success' });
                            history.push('/order-manager');
                        } else {
                            enqueueSnackbar('Thời gian đặt phòng bị trùng', { variant: 'error' });
                        }
                    }
                }
            } catch (error) {
                enqueueSnackbar(error.message, { variant: 'error' });
            }
        } catch (error) {
            enqueueSnackbar(error.message, { variant: 'error' });
        }
    };

    const classes = useStyles();

    const { formState } = form;


    const handleGenerateId = () => {
        form.setValue('customer_id', new Date().getTime());
    }

    return (
        <div className="room-create">
            {formState.isSubmitting && <LinearProgress />}
            <Typography className={classes.title} component="h1" variant="h5">
                create order
            </Typography>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="room-detail-idroom">
                    <Typography  component="h4">số phòng</Typography>
                    <InputField  disabled form={form} name="room_id" label="số phòng" />
                </div>
                <div className="room-detail-name-customer">
                    <Typography component="h4">id Khách Hàng</Typography>
                    <InputField form={form} name="customer_id" label="id khách hàng" />
                    <Button variant='contained' onClick={()=> handleGenerateId()} >Generate id</Button>
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
                    <Typography component="h4">Giá thuê </Typography>

                    <InputField form={form} name="type" label="price/hour" />
                </div>
                <div>
                    <Typography component="h4">Discount</Typography>
                    <InputField form={form} name="discount" label="discount" />
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
                        <IconButton onClick={() => setadditionalCount((prev) => prev.filter((_, i) => i !== prev.length - 1))}>
                            <RemoveIcon />
                        </IconButton>
                    </div>
                    {additionalCount.map((item, index) => (
                        <div className="room-detail-dep-form" key={index}>
                            <InputField form={form} name={`add_price${item}`} placeholder="info" />
                            <InputField form={form} name={`price${item}`} placeholder="price" />
                        </div>
                    ))}
                </div>
                <div>
                    <Typography component="h4">Khách đặt qua kênh nào </Typography>
                    <SelectField selectList={kenhList} form={form} name="type_booking" />
                </div>

                <Button size="large" type="submit" className={classes.submit} variant="contained" color="primary">
                    create order
                </Button>
            </form>
        </div>
    );
}

export default RoomOrderCreate;
