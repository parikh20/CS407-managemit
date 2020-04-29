import React from 'react';
import { createBrowserHistory } from 'history';
import { useHistory } from 'react-router-dom';

import NavBar from './component/NavBar';
import BoardCalendar from './pageBody/BoardCalendar';

import firebase from '../Firebase';

export default (props) => {
    const viewableHistory = createBrowserHistory();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));
    const db = firebase.firestore();
    const primaryDark = "#222831"
    const secondaryDark = "#30476E"
    const darkTextColor = "#c1a57b"
    const black = "#000"
    const white = "#fff"

    const mode = localStorage.darkMode


    mode === 'dark' ? document.body.style.backgroundColor = primaryDark : document.body.style.backgroundColor = white;

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

    let today = new Date();

    return (
        <div>
            <NavBar location={viewableHistory.location.pathname}  />
            <BoardCalendar
                boardId={props.match.params.boardId}
                month={props.match.params.month || today.getMonth()}
                day={props.match.params.day || today.getDate()}
                year={props.match.params.year || today.getFullYear()}
                darkMode={mode}
            />
        </div>
    );
};