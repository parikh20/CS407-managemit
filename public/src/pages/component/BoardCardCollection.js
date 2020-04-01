import React from 'react';

import Grid from '@material-ui/core/Grid';

import BoardCard from './BoardCard.js'

import { db } from '../../Firebase';

class BoardCardCollection extends React.Component {

    boardsSub;
    userSub;

    constructor(props) {
        super(props);
        this.state = {};
        this.user = JSON.parse(localStorage.getItem('user'));
        this.loadBoards(this.user);
    }

    loadBoards(user) {
        if (!user) {
            return;
        }
        if (this.boardsSub) {
            this.boardsSub();
        }
        
        this.boardsSub = db.collection('boards').where('userRefs', 'array-contains', user.email).orderBy('label', 'asc').onSnapshot(boardsRefs => {
            this.setState({boardsRefs: boardsRefs.docs.map(boardRef => {
                let data = boardRef.data();
                data.id = boardRef.id;
                return data;
            })});
        });
    }

    componentWillUnmount() {
        this.boardsSub && this.boardsSub();
        this.userSub && this.userSub.unsubscribe();
    }

    render() {
        return (
            <div style={{width: 80 + '%', margin: '10px auto 0px auto'}}>
                <Grid container spacing={3}>
                    {this.state.boardsRefs && <>
                        {this.state.boardsRefs.map(board => (
                            <BoardCard key={board.id} board={board} />
                        ))}
                    </>}
                </Grid>
            </div>
        );
    }
}

export default BoardCardCollection;