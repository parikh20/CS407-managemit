import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import UserSettingsComponent from '../component/UserSettings';

import { db } from '../../Firebase';

class UserSettings extends React.Component {

    boardSub;

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <UserSettingsComponent />
            </div>
        );
    }
}

export default UserSettings;