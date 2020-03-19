import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import BoardCalendarComponent from '../component/BoardCalendarComponent';

import { db, cache } from '../../Firebase';

class BoardCalendar extends React.Component {

    boardSub;
    taskSub;

    constructor(props) {
        super(props);
        this.state = {
            taskRefs: []
        };
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

            this.loadTasks(boardRef);
        });
    }

    loadTasks(boardRef) {
        if (this.taskSub && this.taskSub.unsubscribe && typeof this.taskSub.unsubscribe === 'function') {
            this.taskSub.unsubscribe();
        }

        this.taskSub = cache.loadTasks(boardRef).subscribe((taskRefs) => {
            this.setState({taskRefs: taskRefs.docs})
        });
    }

    componentWillUnmount() {
        this.boardSub && this.boardSub();
        if (this.taskSub && this.taskSub.unsubscribe && typeof this.taskSub.unsubscribe === 'function') {
            this.taskSub.unsubscribe();
        }
    }

    render() {
        return (
            <div>
                <BoardSubpageBreadcrumbs currentPageName='Calendar' board={this.state.board ? this.state.board : {}} />
                <BoardCalendarComponent
                    board={this.state.board}
                    taskRefs={this.state.taskRefs}
                    month={this.props.month}
                    day={this.props.day}
                    year={this.props.year}
                />
            </div>
        );
    }
}

export default BoardCalendar;