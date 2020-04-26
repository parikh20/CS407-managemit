import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import BoardSettingsComponent from '../component/BoardSettings';

import { db } from '../../Firebase';

class BoardSettings extends React.Component {

    boardSub;
    pointsSub;

    constructor(props) {
        super(props);
        this.state = {};
        this.loadBoard();
        this.loadPoints();
    }

    loadBoard() {
        if (this.boardSub) {
            this.boardSub();
        }
        
        this.boardSub = db.collection('boards').doc(this.props.boardId).onSnapshot((boardRef) => {
            let data = boardRef.data();

            // fix for erroring on board delete
            if (data === undefined) {
                return;
            }
            
            data.id = boardRef.id;
            this.setState({board: data});
        });
    }

    loadPoints() {
        if (this.pointsSub) {
            this.pointsSub()
        }

        this.pointsSub = db.collection('boards').doc(this.props.boardId).collection('points').onSnapshot(pointsRef => {
            let data = {}
            let user;

            for (user in pointsRef.docs) {
                data[pointsRef.docs[user].id] = pointsRef.docs[user].data().points
            }

            this.setState({points: data});
        });
    }

    componentWillUnmount() {
        this.boardSub && this.boardSub();
    }

    render() {
        return (
            <div>
                <BoardSubpageBreadcrumbs currentPageName='Settings' board={this.state.board ? this.state.board : {}} />
                <BoardSettingsComponent board={this.state.board ? this.state.board : {}} points={this.state.points ? this.state.points : {}} />
            </div>
        );
    }
}

export default BoardSettings;