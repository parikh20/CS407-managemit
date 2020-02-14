import React from 'react';

import BoardSettingsBreadcrumbs from '../component/BoardSettingsBreadcrumbs';
import BoardSettingsComponent from '../component/BoardSettings';

import { db } from '../../Firebase';

class BoardSettings extends React.Component {

    boardSub;

    constructor(props) {
        super(props);
        this.state = {};
        this.loadBoard();
    }

    loadBoard() {
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
                <BoardSettingsBreadcrumbs board={this.state.board ? this.state.board : {}} />
                <BoardSettingsComponent board={this.state.board ? this.state.board : {}} />
            </div>
        );
    }
}

export default BoardSettings;