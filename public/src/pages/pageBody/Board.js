import React, { useEffect } from 'react';

import BoardActions from '../component/BoardActions';
import ColumnGroup from '../component/ColumnGroup';

import firebase from '../../Firebase';

function Board(props) {
    const [board, setBoard] = React.useState({});
    const [columns, setColumns] = React.useState([]);
    const [colGroup, setColGroup] = React.useState({});

    let unsubscribeColGroup = null;
    let unsubscribeCols = null;

    const db = firebase.firestore();
    
    let boardQuery = db.collection('boards').doc(props.boardId);
    boardQuery.get().then(docSnapshot => {
        const boardUpdate = docSnapshot.data();
        if (!boardUpdate) {
            return;
        }
        boardUpdate.id = props.boardId;
        setBoard(boardUpdate);
    }, err => {
        console.log('Error fetching board: ' + JSON.stringify(err));
    });

    let columnGroupQuery = db.collection('boards').doc(props.boardId).collection('columnGroups').limit(1); // TODO: limit 1 is temporary - we'll move to querying this differently later
    unsubscribeColGroup = columnGroupQuery.onSnapshot(docSnapshot => {
        docSnapshot.forEach(colGroup => {
            const colGroupUpdate = colGroup.data();
            if (!colGroupUpdate) {
                return;
            }
            colGroupUpdate.id = colGroup.id;
            setColGroup(colGroupUpdate);
        });

    }, err => {
        console.log('Error fetching column group: ' + JSON.stringify(err));
    });

    if (colGroup.id !== undefined) {
        let columnsQuery = db.collection('boards').doc(props.boardId).collection('columnGroups').doc(colGroup.id).collection('columns');
        unsubscribeCols = columnsQuery.onSnapshot(docSnapshot => {
            let newColumns = [];
            docSnapshot.forEach(doc => {
                let data = doc.data();
                data.id = doc.id;
                newColumns.push(data);
            });
            setColumns(newColumns);
        }, err => {
            console.log('Error fetching columns: ' + JSON.stringify(err));
        });
    }

    useEffect(() => {
        return () => {
            unsubscribeColGroup && unsubscribeColGroup();
            unsubscribeCols && unsubscribeCols();
        };
    }, [unsubscribeColGroup, unsubscribeCols]);
    
    return (
        <div>
            <BoardActions board={board} />
            <ColumnGroup board={board} columnGroup={colGroup} columns={columns} />
        </div>
    );
}

export default Board;