import React from 'react';

import BoardSubpageBreadcrumbs from '../component/BoardSubpageBreadcrumbs';
import BoardDocumentsComponent from '../component/BoardDocumentsComponent';

import { db } from '../../Firebase';

class BoardDocuments extends React.Component {

    boardSub;
    filesSub;

    constructor(props) {
        super(props);
        this.state = {
            files: []
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

                this.loadFiles();
            }
        });
    }

    loadFiles() {
        if (this.filesSub) {
            this.filesSub();
        }

        this.filesSub = db.collection('boards').doc(this.props.boardId).collection('files').orderBy('timestamp', 'desc').onSnapshot(fileRefs => {
            let files = [];
            for (const fileRef of fileRefs.docs) {
                let fileData = fileRef.data();
                fileData.id = fileRef.id;
                files.push(fileData);
            }
            this.setState({files: files});
        });
    }

    componentWillUnmount() {
        this.boardSub && this.boardSub();
        this.filesSub && this.filesSub();
    }

    render() {
        return (
            <div>
                <BoardSubpageBreadcrumbs currentPageName='Documents' board={this.state.board ? this.state.board : {}} />
                <BoardDocumentsComponent board={this.state.board} files={this.state.files} />
            </div>
        );
    }
}

export default BoardDocuments;