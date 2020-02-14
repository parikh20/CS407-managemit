import React from 'react';
import { createBrowserHistory } from 'history';
import { useHistory } from 'react-router-dom';

import NavBar from './component/NavBar';
import BoardSettings from './pageBody/BoardSettings';

import { db } from '../Firebase';

export default (props) => {
    const viewableHistory = createBrowserHistory();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));

    db.collection('boards').doc(props.match.params.boardId).get().then(boardRef => {
        if (!boardRef.exists || boardRef.data().owner !== user.email) {
            history.push('/boards');
        }
    }).catch(err => {
        history.push('/boards');
    });


    return (
        <div>
            <NavBar location={viewableHistory.location.pathname}  />
            <BoardSettings boardId={props.match.params.boardId} />
        </div>
    );
};