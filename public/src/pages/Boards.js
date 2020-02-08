import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import Boards from './pageBody/Boards';

export default (props) => {
    const history = createBrowserHistory();

    return (
        <div>
            <NavBar location={history.location.pathname}  />
            <Boards />
        </div>
    );
};