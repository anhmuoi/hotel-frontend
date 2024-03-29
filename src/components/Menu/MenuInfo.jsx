import { Box, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RoomList from '../../features/RoomList/RoomList.jsx';
import RoomOrderList from '../../features/RoomOrderList/RoomOrderList.jsx';
import UserList from '../../features/UserList/UserList.jsx';
import InfoCustomer from '../InfoCustomer/InfoCustomer.jsx';

const tabNameToIndex = {
    0: 'user-manager',
    1: 'room-manager',
    2: 'order-manager',
    3: 'dashboard',
    4: 'info-customer',
};

const indexToTabName = {
    'user-manager': 0,
    'room-manager': 1,
    'order-manager': 2,
    dashboard: 3,
    'info-customer': 4,
};

function MenuInfo({ propsRouter }) {
    const { match, history } = propsRouter;
    const { params } = match;
    const { page } = params;
    const location = useLocation();

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                style={{ flex: 1 }}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    function a11yProps(index) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        history.push(`/${tabNameToIndex[newValue]}`);
        setValue(newValue);
    };

    useEffect(() => {
        if (location.pathname === '/') {
            history.push('/user-manager');
        }
        setValue(indexToTabName[location.pathname.split('/')[1]]);
    }, [location.pathname]);

    return (
        <div className="menu-info">
            <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%', width: '100%' }}>
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    onClick={() => history.push({ pathname: history.location.pathname })}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                >
                    <Tab label="Quản lý người dùng" {...a11yProps(0)} sx={{ margin: '10px' }}></Tab>
                    <Tab label="Quản lý phòng" {...a11yProps(1)} sx={{ margin: '10px' }} />
                    <Tab label="Quản lý đặt phòng" {...a11yProps(2)} sx={{ margin: '10px' }} />
                    <Tab label="Dashboard" {...a11yProps(3)} sx={{ margin: '10px' }} />
                    <Tab label="Thông tin khách hàng" {...a11yProps(3)} sx={{ margin: '10px' }} />
                </Tabs>
                <TabPanel value={value} index={0}>
                    <UserList />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <RoomList />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <RoomOrderList />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <RoomOrderList />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <InfoCustomer />
                </TabPanel>
            </Box>
        </div>
    );
}

export default MenuInfo;
