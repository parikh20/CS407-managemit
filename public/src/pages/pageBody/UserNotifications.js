import React from 'react';

import UserNotificationsComponent from '../component/UserNotificationsComponent';

import { db } from '../../Firebase';

class UserNotifications extends React.Component {

    notificationsSub;

    constructor(props) {
        super(props);

        this.user = JSON.parse(localStorage.getItem('user'));
        this.state = {
            notificationRefs: []
        };
        this.loadNotifications();
    }

    loadNotifications() {
        if (this.notificationsSub) {
            this.notificationsSub();
        }
        
        this.notificationsSub = db.collection('users').doc(this.user.email).collection('notifications').orderBy('timestamp', 'desc').onSnapshot(notificationRefs => {
            this.setState({notificationRefs: notificationRefs.docs});
        });
    }

    componentWillUnmount() {
        this.notificationsSub && this.notificationsSub();
    }

    render() {
        return (
            <div>
                <UserNotificationsComponent
                    notificationRefs={this.state.notificationRefs}
                />
            </div>
        );
    }
}

export default UserNotifications;