import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import BoardApiSettingsComponent from '../component/BoardApiSettingsComponent';

import { db } from '../../Firebase';

class BoardApiSettings extends React.Component {

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

            // fix for erroring on board delete
            if (data === undefined) {
                return;
            }
            
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
                <BoardSubpageBreadcrumbs currentPageName='API call settings' showSettings={true} board={this.state.board ? this.state.board : {}} />
                <BoardApiSettingsComponent board={this.state.board ? this.state.board : {}} />
            </div>
        );
    }
}

export default BoardApiSettings;