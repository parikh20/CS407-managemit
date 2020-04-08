import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import BoardApiSettingsComponent from '../component/BoardApiSettingsComponent';

import { db } from '../../Firebase';

class BoardApiSettings extends React.Component {

    boardSub;
    apiCallsSub;

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

            this.loadApiCalls();
        });
    }

    loadApiCalls() {
        if (this.apiCallsSub) {
            this.apiCallsSub();
        }

        this.apiCallsSub = db.collection('boards').doc(this.state.board.id).collection('apiCalls').orderBy('name', 'asc').onSnapshot(apiCallRefs => {
            this.setState({apiCallRefs: apiCallRefs.docs});
        });
    }

    componentWillUnmount() {
        this.boardSub && this.boardSub();
        this.apiCallsSub && this.apiCallsSub();
    }

    render() {
        return (
            <div>
                <BoardSubpageBreadcrumbs currentPageName='API call settings' showSettings={true} board={this.state.board ? this.state.board : {}} />
                <BoardApiSettingsComponent
                    board={this.state.board ? this.state.board : {}}
                    apiCallRefs={this.state.apiCallRefs ? this.state.apiCallRefs : []}
                />
            </div>
        );
    }
}

export default BoardApiSettings;