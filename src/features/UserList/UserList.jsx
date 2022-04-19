import React, { useEffect, useState } from 'react';
import userApi from '../../api/userApi.js';
import UserManager from '../../components/UserManager/UserManager.jsx';
import './UserList.scss';

const UserList = () => {
    const [userList, setUserList] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const data = await userApi.getAll();
                console.log(data);
                setUserList(data.data.data);
            } catch (error) {
                console.log(error);
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
