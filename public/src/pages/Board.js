import React from 'react';
import { createBrowserHistory } from 'history';
import { useHistory } from 'react-router-dom';

import NavBar from './component/NavBar';
import Board from './pageBody/Board';

import firebase from '../Firebase';

export default (props) => {
    const viewableHistory = createBrowserHistory();
    const history = useHistory();
    const user = JSON.parse(localStorage.getItem('user'));

    const db = firebase.firestore();
    db.collection('boards').where('userRefs', 'array-contains', user.email).get().then(async (snapshot) => {
        for (const doc of snapshot.docs) {
            if (doc.id === props.match.params.boardId) {
                if (props.match.params.groupId === undefined) {
                    return;
                }

                let columnGroupRefs = await doc.ref.collection('columnGroups').get();
                for (const doc of columnGroupRefs.docs) {
                    if (doc.id === props.match.params.groupId) {
                        return
                    }
                }
            }
        }
        history.push('/boards');
    }).catch(err => {
        history.push('/boards');
    });

    // Check if we have the query param for sorting
    let sortMode = null;
    if (viewableHistory.location.search && viewableHistory.location.search.startsWith('?sort=')) {
        sortMode = viewableHistory.location.search.substring(6);
        if (!['titleAsc', 'titleDesc', 'date', 'users'].includes(sortMode)) {
            sortMode = null;
        }
    }

    return (
        <div>
            <NavBar location={viewableHistory.location.pathname} sortMode={sortMode} />
            <Board history={history} boardId={props.match.params.boardId} sortMode={sortMode} lockFunctionality={sortMode !== null} params={props.match.params} />
        </div>
    );
};