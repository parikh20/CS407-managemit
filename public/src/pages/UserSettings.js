import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import UserSettings from './pageBody/UserSettings';

import { db } from '../Firebase';

class UserSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.viewableHistory = createBrowserHistory();
        const user = JSON.parse(localStorage.getItem('user'));
    }

    

    render() {
        return (
            <div>
                <NavBar location={this.viewableHistory.location.pathname}  />
                <UserSettings />
            </div>
        );
    }
};

export default UserSettingsPage;