import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import Login from './pageBody/Login';

export default (props) => {
    const history = createBrowserHistory();

    return (
        <div>
            <NavBar location={history.location.pathname}  />
            <Login />
        </div>
    );
};