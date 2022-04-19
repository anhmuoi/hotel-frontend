import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import './RoomOrderCreate.scss';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LinearProgress, makeStyles, Typography } from '@material-ui/core';
import InputField from '../../../../components/form-controls/InputField/index.jsx';
import CheckBoxField from '../../../../components/form-controls/CheckBoxField/index.jsx';
import SelectField from '../../../../components/form-controls/SelectField/index.jsx';
import { useRouteMatch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import storageKeys from '../../../../constants/storage-key.js';
import orderApi from '../../../../api/orderApi.js';
import AddBoxIcon from '@mui/icons-material/AddBox';
import RemoveIcon from '@mui/icons-material/Remove';
import DateTimeField from '../../../../components/form-controls/DateTimeField/index.jsx';

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

const kenhList = ['online', 'sale'];

function RoomOrderCreate(props) {
    const user = useSelector((state) => state.user);
    console.log(user.current.data.name);
    const [additionalCount, setadditionalCount] = React.useState([1]);
    const roomList = useSelector((state) => state.room);

    const schema = yup.object().shape({
        idroom: yup
            .number()
            .test('idroom', 'phòng này không tồn tại', (value) => {
                const room = roomList.RoomList.find((room) => Number(room.id) === +value);

                if (room) {
                    return true;
                } else {
                    return false;
                }
            })
            .required('Vui lòng chọn phòng'),
        namecustomer: yup.string().required('Tên không được để trống'),
        namestaff: yup.string().required('Nhân viên không được để trống'),
        phonecustomer: yup.string().required('Số điện thoại không được để trống'),
        type: yup.number().required('price/hour không được để trống'),
        in_expected: yup.date().required('Thời gian dự kiến không được để trống'),
        out_expected: yup.string().required('Thời gian dự kiến không được để trống'),
        in_reality: yup.string(),
        out_reality: yup.string(),
    });
    const form = useForm({
        defaultValues: {
            idroom: '',
            namecustomer: '',
            namestaff: '',
            phonecustomer: '',
            type: '',
            kenh: '',
            in_expected: null,
            out_expected: null,
            in_reality: null,
            out_reality: null,
        },
        resolver: yupResolver(schema),
    });

    const handleSubmit = async (values) => {
        try {
            const additional_price = [];
            additionalCount.map((item, index) => {
                additional_price.push({ info: values[`add_price${index + 1}`], price: values[`price${index + 1}`] });
                delete values[`price${index + 1}`];
                delete values[`add_price${index + 1}`];
            });
            // delete values['date'];
            values.additional_price = additional_price;
            values.user = JSON.parse(localStorage.getItem(storageKeys.USER)).user;
            const data = [];
            data.push({ room_id: values['idroom'] });
            values.data = data;

            const result = await orderApi.create(values);
        } catch (error) {
            console.log(error);
        }
    };

    const classes = useStyles();

    const { formState } = form;

    return (
        <div className="room-create">
            {formState.isSubmitting && <LinearProgress />}
            <Typography className={classes.title} component="h1" variant="h5">
                create order
            </Typography>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="room-detail-idroom">
                    <Typography component="h4">số phòng</Typography>
                    <InputField form={form} name="idroom" label="số phòng" />
                </div>
                <div className="room-detail-name-customer">
                    <Typography component="h4">Tên Khách Hàng</Typography>
                    <InputField form={form} name="namecustomer" label="tên khách hàng" />
                </div>
                <div>
                    <Typography component="h4">Tên Nhân viên bán hàng</Typography>
                    <InputField form={form} name="namestaff" label="tên nhân viên" />
                </div>
                <div>
                    <Typography component="h4">Số ĐT Khách hàng</Typography>
                    <InputField form={form} name="phonecustomer" label="SĐT" />
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
                        <IconButton onClick={() => setadditionalCount(additionalCount.splice(-1))}>
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
                    <SelectField selectList={kenhList} form={form} name="kenh" />
                </div>

                <Button size="large" type="submit" className={classes.submit} variant="contained" color="primary">
                    create order
                </Button>
            </form>
        </div>
    );
}

export default RoomOrderCreate;
