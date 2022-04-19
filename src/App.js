import React from 'react';
import { Route } from 'react-router-dom';
import './App.scss';
import RoutesWrapper from './page/Routers/Router.jsx';

function App() {
    return (
        <div className="app">
            <Route path="/" component={RoutesWrapper} />
            {/* <Switch>
                <Redirect exact from="/home" to="/home/user-manager" />
                <Route exact path="/home/:page?" render={(props) => <Home {...props} />} />
            </Switch> */}
        </div>
    );
}

export default App;
