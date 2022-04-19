import React from 'react';
import { Redirect } from 'react-router-dom';
import { Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import MenuInfo from '../../components/Menu/MenuInfo.jsx';
import RoomList from '../../features/RoomList/RoomList.jsx';
import './Home.scss';

function Home(props) {
    return (
        <div className="home">
            {/* <h1 className='title'>Room</h1>
            <RoomList listRoom={listRoom} /> */}
            <MenuInfo propsRouter={props} />
           
        </div>
    );
}

export default Home;
