import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar, Button, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import InputField from '../../../../components/form-controls/InputField/index.jsx';
import PasswordField from '../../../../components/form-controls/PasswordField/index.js';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

RegisterForm.propTypes = {
    onSubmit: PropTypes.func,
};

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

const regexPhone = new RegExp(/^(\+91-|\+91|0)?\d{10}$/);

function RegisterForm(props) {
    const { onSubmit } = props;

    const schema = yup.object().shape({
        name: yup
            .string()
            .required('Please enter your name')
            .min(6, 'Please enter at least 6 characters'),

        // email or phone
        email: yup
            .string('Enter your Email Number')
            // .email("Enter a valid email")
            .required('Email Number is required')
            .test('test-email', 'Enter Valid Email', function (value) {
                const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

                let isValidEmail = emailRegex.test(value);
                if (!isValidEmail) {
                    return false;
                }
                return true;
            }),
        phone: yup
            .string('Enter your Phone Number')
            // .email("Enter a valid email")
            .required('Phone Number is required')
            .test('test-phone', 'Enter Valid Phone', function (value) {
                const phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change this regex based on requirement
                let isValidPhone = phoneRegex.test(value);
                if (!isValidPhone) {
                    return false;
                }
                return true;
            }),

        type: yup.mixed().oneOf(['admin', 'user']).required('Please type user or admin'),

        password: yup.string().required('Please enter your password').min(6, 'Please enter at lease 6 characters'),

        retypePassword: yup
            .string()
            .required('Please enter retype-password')
            .oneOf([yup.ref('password')], 'Password does not match'),
        //oneOf nghĩa là giá trị của retype phải là 1 trong những giá trị chứa trong mảng này
        // ref là để lấy giá trị của  các field nào đó
    });
    const form = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            password: '',
            retypePassword: '',
            type: '',
            location: '',
        },
        resolver: yupResolver(schema),
    });

    const handleSubmit = async (values) => {
        console.log(values);
        delete values.retypePassword;
        await onSubmit(values);
    };

    const classes = useStyles();

    const { formState } = form;

    return (
        <div>
            {formState.isSubmitting && <LinearProgress />}

            {/* <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar> */}
            <Typography className={classes.title} component="h1" variant="h5">
                Sign Up
            </Typography>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <InputField form={form} name="name" label="Name" />
                <InputField form={form} name="email" label="Email" />
                <InputField form={form} name="phone" label="Phone" />
                <PasswordField form={form} name="password" label="Password" />
                <PasswordField form={form} name="retypePassword" label="Retype Password" />
                <InputField form={form} name="type" label="Type" placeholder={'admin or user'} />
                <InputField form={form} name="location" label="Location" />

                <Button size="large" type="submit" className={classes.submit} fullWidth variant="contained" color="primary">
                    Create An Account
                </Button>
            </form>
        </div>
    );
}

export default RegisterForm;
