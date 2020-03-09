import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import BoardHistoryComponent from '../component/BoardHistoryComponent';

import { db } from '../../Firebase';

class BoardHistory extends React.Component {

    boardSub;
    historySub;

    constructor(props) {
        super(props);
        this.state = {
            history: []
        };
        this.loadBoard();
    }

    loadBoard() {
        if (this.boardSub) {
            this.boardSub();
        }
        
        this.boardSub = db.collection('boards').doc(this.props.boardId).onSnapshot(boardRef => {
            if (!boardRef.exists) {
                this.props.history.push('/boards');
            } else {
                let data = boardRef.data();
                data.id = boardRef.id;
                this.setState({board: data});

                this.loadHistory();
            }
        });
    }

    loadHistory() {
        if (this.historySub) {
            this.historySub();
        }

        this.historySub = db.collection('boards').doc(this.props.boardId).collection('history').orderBy('timestamp', 'desc').onSnapshot(historyRefs => {
            let history = [];
            for (const historyRef of historyRefs.docs) {
                history.push(historyRef.data());
            }
            this.setState({history: history});
        });
    }

    componentWillUnmount() {
        this.boardSub && this.boardSub();
        this.historySub && this.historySub();
    }

    render() {
        return (
            <div>
                <BoardSubpageBreadcrumbs currentPageName='History' board={this.state.board ? this.state.board : {}} />
                <BoardHistoryComponent board={this.state.board} history={this.state.history} />
            </div>
        );
    }
}

export default BoardHistory;