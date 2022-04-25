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
import { logout } from '../../page/Auth/authSlice.js';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useHistory } from 'react-router-dom';
import storageKeys from '../../constants/storage-key.js';

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

export default function Header() {
    const classes = useStyles();

    const LoggedIn = JSON.parse(localStorage.getItem(storageKeys.USER));

    const history = useHistory();

    const isLoggedIn = LoggedIn?.user;

    const [mode, setMode] = useState(MODE.LOGIN);

    const [open, setOpen] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);

    const dispatch = useDispatch();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClickMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        handleCloseMenu();
        const action = logout();
        dispatch(action);
        history.push('/auth');
    };

    useEffect(() => {
        if (!LoggedIn) {
            history.push('/auth');
        } else {
            
        }
    }, [LoggedIn]);

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <CodeIcon className={classes.menuButton} />

                    <Typography variant="h6" className={classes.title}>
                        <Link className={classes.link} to="/">
                            Logo
                        </Link>
                    </Typography>

                    {!!isLoggedIn && (
                        <IconButton aria-haspopup="true" onClick={handleClickMenu}>
                            <AccountCircle className={classes.link} color="inherit"></AccountCircle>
                        </IconButton>
                    )}
                    {!!!isLoggedIn && (
                        <Button onClick={handleClickOpen} color="inherit">
                            Login
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Menu className={classes.menu} id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                <MenuItem onClick={handleLogOut}>Logout</MenuItem>
            </Menu>
        </div>
    );
}
