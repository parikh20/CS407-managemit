import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import UserSettingsComponent from '../component/UserSettingsComponent';

import { db } from '../../Firebase';

class UserSettings extends React.Component {

    settingsSub;

    constructor(props) {
        super(props);
        this.state = {
            settings: {}
        }
        this.loadSettings();
    }

    loadSettings() {
        if (this.settingsSub) {
            this.settingsSub();
        }
        
        const user = JSON.parse(localStorage.getItem('user'));
        this.settingsSub = db.collection('users').doc(user.uid).onSnapshot(settingsRef => {
            let data = settingsRef.data();
            this.setState({settings: data});
        });
    }

    componentWillUnmount() {
        this.settingsSub && this.settingsSub()
    }

    render() {
        return (
            <div>
                <UserSettingsComponent settings={this.state.settings} />
            </div>
        );
    }
}

export default UserSettings;