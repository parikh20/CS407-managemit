import React, { useState, useEffect } from 'react';

import Grid from '@material-ui/core/Grid';

import BoardCard from './BoardCard.js'

import firebase from '../../Firebase';

function BoardCardCollection(props) {
    const [boards, setBoards] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    const db = firebase.firestore();
    let query = db.collection('boards').where('userRefs', 'array-contains', user.uid).orderBy('label', 'asc');
    let unsubscribe = query.onSnapshot(querySnapshot => {
        let newBoards = [];
        querySnapshot.docs.forEach(doc => {
            let data = doc.data();
            data.id = doc.id;
            newBoards.push(data);
        });
        setBoards(newBoards);
    }, err => {
        console.log('Error fetching boards: ' + JSON.stringify(err));
    });

    useEffect(() => {
        return () => {
            unsubscribe();
        };
    }, [unsubscribe]);

    return (
        <div style={{width: 80 + '%', margin: '10px auto 0px auto'}}>
            <Grid container spacing={3}>
                {boards.map(board => (
                    <BoardCard key={board.id} board={board} />
                ))}
            </Grid>
        </div>
    );
}

export default BoardCardCollection;