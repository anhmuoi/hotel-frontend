import { Badge, Box, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { AccountCircle, Close, ShoppingCart } from '@material-ui/icons';
import CodeIcon from '@material-ui/icons/Code';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useHistory } from 'react-router-dom';
import Login from './components/Login/index.jsx';
import Register from './components/Register/index.jsx';
import { logout } from './authSlice.js';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
    },
    closeButton: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
        color: theme.palette.grey[500],
        zIndex: '1',
    },
    menu: {
        top: theme.spacing(5),
        'margin-top': theme.spacing(6),
    },
}));

const MODE = {
    LOGIN: 'login',
    REGISTER: 'register',
};

export default function Auth() {
    const classes = useStyles();

    const history = useHistory();

    const [mode, setMode] = useState(MODE.LOGIN);

    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('user')) {
            history.push('/');
        }
    },[])

    return (
        <div className={classes.root}>
            <Dialog disableEscapeKeyDown open={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogContent>
                    {mode === MODE.REGISTER && (
                        <>
                            <Register />
                            <Box textAlign="center">
                                <Button color="primary" onClick={() => setMode(MODE.LOGIN)} style={{ color: '#1890FF' }}>
                                    Already have an account. Login here
                                </Button>
                            </Box>
                        </>
                    )}
                    {mode === MODE.LOGIN && (
                        <>
                            <Login />
                            <Box textAlign="center">
                                <Button color="primary" onClick={() => setMode(MODE.REGISTER)} style={{ color: '#1890FF' }}>
                                    Dont have an account. Register here
                                </Button>
                            </Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
