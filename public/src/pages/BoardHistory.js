import React from 'react';
import { createBrowserHistory } from 'history';
import { useHistory } from 'react-router-dom';

import NavBar from './component/NavBar';
import BoardHistory from './pageBody/BoardHistory';

import firebase from '../Firebase';

export default (props) => {
    const viewableHistory = createBrowserHistory();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));
    const mode = localStorage.darkMode
    const primaryDark = "#222831"
    const white = "#fff"
    mode === 'dark' ? document.body.style.backgroundColor = primaryDark : document.body.style.backgroundColor = white;
    
    const db = firebase.firestore();
    db.collection('boards').where('userRefs', 'array-contains', user.email).get().then(snapshot => {
        for (const doc of snapshot.docs) {
            if (doc.id === props.match.params.boardId) {
                return;
            }
        }
        history.push('/boards');
    }).catch(err => {
        history.push('/boards');
    });


    return (
        <div>
            <NavBar location={viewableHistory.location.pathname}  />
            <BoardHistory boardId={props.match.params.boardId} />
        </div>
    );
};