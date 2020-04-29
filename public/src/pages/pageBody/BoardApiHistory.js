import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import BoardApiHistoryComponent from '../component/BoardApiHistoryComponent';

import { db } from '../../Firebase';

class BoardApiHistory extends React.Component {

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

        this.historySub = db.collection('boards').doc(this.props.boardId).collection('apiHistory').orderBy('timestamp', 'desc').onSnapshot(historyRefs => {
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
                <BoardSubpageBreadcrumbs currentPageName='API history' showSettings={true} board={this.state.board ? this.state.board : {}} />
                <BoardApiHistoryComponent board={this.state.board} history={this.state.history} />
            </div>
        );
    }
}

export default BoardApiHistory;