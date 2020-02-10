import React from 'react';

import BoardActions from '../component/BoardActions';
import ColumnGroup from '../component/ColumnGroup';

import firebase from '../../Firebase';

function Boards(props) {
    const [board, setBoard] = React.useState({});
    const [columns, setColumns] = React.useState([]);
    const [colGroup, setColGroup] = React.useState({});

    const user = JSON.parse(localStorage.getItem('user'));
    const db = firebase.firestore();

    let boardQuery = db.collection('boards').doc(props.boardId);
    boardQuery.onSnapshot(docSnapshot => {
        const boardUpdate = docSnapshot.data();
        boardUpdate.id = props.boardId;
        setBoard(boardUpdate);
    }, err => {
        console.log('Error fetching board: ' + JSON.stringify(err));
    });

    let columnsQuery = db.collection('columns').where('boardRef', '==', props.boardId);
    columnsQuery.onSnapshot(docSnapshot => {
        let newColumns = [];
        docSnapshot.docs.forEach(doc => {
            let data = doc.data();
            data.id = doc.id;
            newColumns.push(data);
        });
        setColumns(newColumns);
    }, err => {
        console.log('Error fetching columns: ' + JSON.stringify(err));
    });
    
    return (
        <div>
            <BoardActions board={board} />
            <ColumnGroup board={board} columns={columns} />
        </div>
    );
}

export default Boards;