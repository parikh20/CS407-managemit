import React from 'react';

import BoardSettingsBreadcrumbs from '../component/BoardSettingsBreadcrumbs';
import BoardSettingsComponent from '../component/BoardSettings';

import firebase from '../../Firebase';

function BoardSettings(props) {
    const [board, setBoard] = React.useState({});
    const user = JSON.parse(localStorage.getItem('user'));

    const db = firebase.firestore();
    let query = db.collection('boards').doc(props.boardId).get().then(docSnapshot => {
        const boardUpdate = docSnapshot.data();
        boardUpdate.id = props.boardId;
        setBoard(boardUpdate);
    }, err => {
        console.log('Error fetching board: ' + JSON.stringify(err));
    });

    return (
        <div>
            <BoardSettingsBreadcrumbs board={board} />
            <BoardSettingsComponent board={board} />
        </div>
    );
}

export default BoardSettings;