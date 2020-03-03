import React from 'react';
import { createBrowserHistory } from 'history';

import NavBar from './component/NavBar';
import BoardSettings from './pageBody/BoardSettings';

import { db } from '../Firebase';

class BoardSettingsPage extends React.Component {
    constructor(props) {
        super(props);

        this.viewableHistory = createBrowserHistory();
        const user = JSON.parse(localStorage.getItem('user'));

        db.collection('boards').doc(props.match.params.boardId).get().then(boardRef => {
            const data = boardRef.data();
            if (!boardRef.exists || !data.permissions.hasOwnProperty(user.email) || data.permissions[user.email].isAdmin === false) {
                this.props.history.push('/boards');
            }
        }).catch(err => {
            this.props.history.push('/boards');
        });
    }
    
    render() {
        return (
            <div>
                <NavBar location={this.viewableHistory.location.pathname}  />
                <BoardSettings boardId={this.props.match.params.boardId} />
            </div>
        );
    }
};

export default BoardSettingsPage;