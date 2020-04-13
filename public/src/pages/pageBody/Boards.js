import React from 'react';

import BoardsActions from '../component/BoardsActions';
import BoardCardCollection from '../component/BoardCardCollection';

import { db } from '../../Firebase';

class Boards extends React.Component {

    boardsSub;

    constructor(props) {
        super(props);
        this.state = {
            boardRefs: []
        };
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
        
        this.boardsSub = db.collection('boards').where('userRefs', 'array-contains', user.email).orderBy('label', 'asc').onSnapshot(boardRefs => {
            this.setState({boardRefs: boardRefs.docs.map(boardRef => {
                let data = boardRef.data();
                data.id = boardRef.id;
                return data;
            })});
        });
    }

    componentWillUnmount() {
        this.boardsSub && this.boardsSub();
    }

    render() {
        return (
            <div>
                <BoardsActions />
                <BoardCardCollection boardRefs={this.state.boardRefs} sortMode={this.props.sortMode} />
            </div>
        );
    }
}

export default Boards;