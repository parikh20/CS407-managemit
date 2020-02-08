import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import Register from './pageBody/Register';

export default (props) => {
    const history = createBrowserHistory();

    return (
        <div>
            <NavBar location={history.location.pathname}  />
            <Register />
        </div>
    );
};