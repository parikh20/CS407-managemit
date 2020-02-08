import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import Board from './pageBody/Boards';

export default (props) => {
    const history = createBrowserHistory();

    return (
        <div>
            <NavBar location={history.location.pathname}  />
            <Board />
        </div>
    );
};