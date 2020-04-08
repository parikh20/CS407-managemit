import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import UserSettings from './pageBody/UserSettings';

class UserSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.viewableHistory = createBrowserHistory();
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