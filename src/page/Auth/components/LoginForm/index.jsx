import { yupResolver } from '@hookform/resolvers/yup';
import { Avatar, Button, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import PropTypes from 'prop-types';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputField from '../../../../components/form-controls/InputField/index.jsx';
import PasswordField from '../../../../components/form-controls/PasswordField/index.js';
LoginForm.propTypes = {
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

function LoginForm(props) {
    const { onSubmit } = props;

    const schema = yup.object().shape({
        email: yup.string().required('Please enter your email').email('Please enter invalid email'),

        password: yup.string().required('Please enter your password').min(6, 'Please enter at lease 6 characters'),

        //oneOf nghĩa là giá trị của retype phải là 1 trong những giá trị chứa trong mảng này
        // ref là để lấy giá trị của  các field nào đó
    });
    const form = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: yupResolver(schema),
    });

    const handleSubmit = async (values) => {
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
                Sign In
            </Typography>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <InputField form={form} name="email" label="Email" />
                <PasswordField form={form} name="password" label="Password" />

                <Button size="large" type="submit" className={classes.submit} fullWidth variant="contained" color="primary">
                    Sign In
                </Button>
            </form>
        </div>
    );
}

export default LoginForm;
