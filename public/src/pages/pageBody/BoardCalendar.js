import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import BoardCalendarComponent from '../component/BoardCalendarComponent';

import { db } from '../../Firebase';

class BoardCalendar extends React.Component {

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
                <BoardSubpageBreadcrumbs currentPageName='Calendar' board={this.state.board ? this.state.board : {}} />
                <BoardCalendarComponent board={this.state.board} />
            </div>
        );
    }
}

export default BoardCalendar;