import React from 'react';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { RoutesString } from './routesString';
import pages from './pages';
import MenuInfo from '../../components/Menu/MenuInfo.jsx';
import Header from '../../components/Header/index.jsx';
import Home from '../Home/Home.jsx';
import { useRouteMatch } from 'react-router-dom';
import RoomDetail from '../../features/RoomList/components/RoomDetail/RoomDetail.jsx';
import RoomCreate from '../../features/RoomList/components/RoomCreate/RoomCreate.jsx';
import RoomOrderDetail from '../../features/RoomOrderList/components/RoomOrderDetail/RoomOrderDetail.jsx';
import RoomOrderCreate from '../../features/RoomOrderList/components/RoomOrderCreate/RoomOrderCreate.jsx';
import UserDetail from '../../features/UserList/components/UserDetail/UserDetail.jsx';

const RenderHeader = (isHeader, history) => {
    if (!isHeader) {
        return <Header />;
        // return <MenuInfo>/</MenuInfo>;
    }
};

function RoutesWrapper() {
    const history = useHistory();

    const isHistoryCheck = () => {
        if (history.location.pathname.toLowerCase() !== RoutesString.PageNotFound && history.location.pathname.toLowerCase() !== RoutesString.Auth) {
            return false;
        } else {
            return true;
        }
    };

    return (
        <>
            {RenderHeader(isHistoryCheck(), history)}
            <Switch>
                {pages.map((item) => {
                    return <Route key={item.path} path={item.path} component={item.component} exact={item.exact}></Route>;
                })}
                <Redirect exact from="/" to="/user-manager" />
                <Route exact path="/user-manager" render={(props) => <Home {...props} />} />
                <Route exact path="/room-manager" render={(props) => <Home {...props} />} />
                <Route exact path="/dashboard" render={(props) => <Home {...props} />} />
                <Route exact path="/order-manager" render={(props) => <Home {...props} />} />

                <Route exact path={`/room-manager/create`} component={RoomCreate}></Route>
                <Route exact path={`/room-manager/:roomId`} component={RoomDetail}></Route>
                <Route exact path={`/order-manager/create`} component={RoomOrderCreate}></Route>
                <Route exact path={`/order-manager/:roomOrderId`} component={RoomOrderDetail}></Route>
                <Route exact path={`/user-manager/:userId`} component={UserDetail}></Route>

                <Redirect to={RoutesString.PageNotFound} />
            </Switch>
        </>
    );
}

export default RoutesWrapper;
