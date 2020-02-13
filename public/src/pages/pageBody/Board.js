import React from 'react';

import BoardActions from '../component/BoardActions';
import ColumnGroup from '../component/ColumnGroup';

import firebase from '../../Firebase';

function Board(props) {
    const [board, setBoard] = React.useState({});
    const [columns, setColumns] = React.useState([]);
    const [colGroup, setColGroup] = React.useState({});

    const db = firebase.firestore();
    
    let boardQuery = db.collection('boards').doc(props.boardId);
    boardQuery.get().then(docSnapshot => {
        const boardUpdate = docSnapshot.data();
        if (!boardUpdate) {
            return;
        }
        boardUpdate.id = props.boardId;
        setBoard(boardUpdate);
        
        // let columnGroupQuery = db.collection('columnGroup').doc(boardUpdate.defaultColumnGroup);
        // columnGroupQuery.onSnapshot(docSnapshot => {
        //     const colGroupUpdate = docSnapshot.data();
        //     if (!colGroupUpdate) {
        //         return;
        //     }
        //     colGroupUpdate.id = boardUpdate.defaultColumnGroup;
        //     setColGroup(colGroupUpdate);
        // }, err => {
        //     console.log('Error fetching column group: ' + JSON.stringify(err));
        // });

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
    }, err => {
        console.log('Error fetching board: ' + JSON.stringify(err));
    });
    
    return (
        <div>
            <BoardActions board={board} />
            <ColumnGroup board={board} columnGroup={colGroup} columns={columns} />
        </div>
    );
}

export default Board;