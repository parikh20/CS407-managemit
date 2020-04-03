import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import UserNotifications from './pageBody/UserNotifications';

export default (props) => {
    const viewableHistory = createBrowserHistory();

    return (
        <div>
            <NavBar location={viewableHistory.location.pathname}  />
            <UserNotifications />
        </div>
    );
};