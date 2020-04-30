import React from 'react';
import { createBrowserHistory } from 'history';
import { useHistory } from 'react-router-dom';

import NavBar from './component/NavBar';
import BoardApiHistory from './pageBody/BoardApiHistory';

import firebase from '../Firebase';

export default (props) => {
    const viewableHistory = createBrowserHistory();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));

    const db = firebase.firestore();
    db.collection('boards').doc(props.match.params.boardId).get().then(boardRef => {
        const data = boardRef.data();
        if (!boardRef.exists || !data.permissions.hasOwnProperty(user.email) || data.permissions[user.email].isAdmin === false) {
            this.props.history.push('/boards');
        }
    }).catch(err => {
        this.props.history.push('/boards');
    });


    return (
        <div>
            <NavBar location={viewableHistory.location.pathname}  />
            <BoardApiHistory boardId={props.match.params.boardId} />
        </div>
    );
};