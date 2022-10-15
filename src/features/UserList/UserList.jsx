import React, { useEffect, useState } from 'react';
import userApi from '../../api/userApi.js';
import UserManager from '../../components/UserManager/UserManager.jsx';
import './UserList.scss';
import { useSnackbar } from 'notistack';


const UserList = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [userList, setUserList] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const data = await userApi.getAll();
                setUserList(data.data);
            } catch (error) {
                enqueueSnackbar(error.message, { variant: 'error' });
            }
        })();
    }, []);

    return (
        <div className="user-list">
            <UserManager userList={userList} />
        </div>
    );
};

export default UserList;
