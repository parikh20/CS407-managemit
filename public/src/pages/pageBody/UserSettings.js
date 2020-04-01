import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import UserSettingsComponent from '../component/UserSettingsComponent';

import { db } from '../../Firebase';

class UserSettings extends React.Component {

    settingsSub;
    boardsSub;

    constructor(props) {
        super(props);
        this.state = {
            settings: {},
            boards: []
        }
        this.loadSettings();
        this.loadAllBoards();
    }

    loadSettings() {
        if (this.settingsSub) {
            this.settingsSub();
        }
        
        const user = JSON.parse(localStorage.getItem('user'));
        this.settingsSub = db.collection('users').doc(user.email).onSnapshot(settingsRef => {
            let data = settingsRef.data();
            this.setState({settings: data});
        });
    }

    loadAllBoards() {
        if (this.boardsSub) {
            this.boardsSub();
        }

        const boardArr = [];

        const user = JSON.parse(localStorage.getItem('user'));
        this.boardSub = db.collection('boards').where("userRefs", "array-contains", user.email).onSnapshot(boardsRef => {
            boardsRef.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                boardArr.push(data);
            });
            this.setState({boards: boardArr});
        });
    }

    componentWillUnmount() {
        this.settingsSub && this.settingsSub()
        this.boardsSub && this.boardsSub();
    }

    render() {
        return (
            <div>
                <UserSettingsComponent settings={this.state.settings} boards={this.state.boards} />
            </div>
        );
    }
}

export default UserSettings;