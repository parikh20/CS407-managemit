import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import Board from './pageBody/Board';

export default (props) => {
    const history = createBrowserHistory();

    return (
        <div>
            <NavBar location={history.location.pathname}  />
            <Board />
        </div>
    );
};