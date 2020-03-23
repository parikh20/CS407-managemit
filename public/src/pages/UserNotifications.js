import React from 'react';
import { createBrowserHistory } from 'history';
import { useHistory } from 'react-router-dom';

import NavBar from './component/NavBar';
import UserNotifications from './pageBody/UserNotifications';

import firebase from '../Firebase';

export default (props) => {
    const viewableHistory = createBrowserHistory();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div>
            <NavBar location={viewableHistory.location.pathname}  />
            <UserNotifications />
        </div>
    );
};