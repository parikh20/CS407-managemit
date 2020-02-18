import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import BoardHistoryComponent from '../component/BoardHistoryComponent';

import { db } from '../../Firebase';

class BoardHistory extends React.Component {

    boardSub;

    constructor(props) {
        super(props);
        this.state = {};
        this.loadBoard();
    }

    loadBoard() {
        if (this.boardSub) {
            this.boardSub();
        }
        
        this.boardSub = db.collection('boards').doc(this.props.boardId).onSnapshot((boardRef) => {
            let data = boardRef.data();
            data.id = boardRef.id;
            this.setState({board: data});
        });
    }

    componentWillUnmount() {
        this.boardSub && this.boardSub();
    }

    render() {
        return (
            <div>
                <BoardSubpageBreadcrumbs currentPageName='History' board={this.state.board ? this.state.board : {}} />
                <BoardHistoryComponent board={this.state.board} />
            </div>
        );
    }
}

export default BoardHistory;