import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import BoardsActions from '../component/BoardsActions';
import BoardCardCollection from '../component/BoardCardCollection';

import { db } from '../../Firebase';
import color from '@material-ui/core/colors/amber';

const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    darkBody: {
        backgroundColor: primaryDark
    },
    whiteBody: {
        backgroundColor: white
    }
}));

class Boards extends React.Component {
    // classes = useStyles();

    boardsSub;

    constructor(props) {
        super(props);
        this.state = {
            boardRefs: []
            // mode: 'white'
        };
        this.user = JSON.parse(localStorage.getItem('user'));
        console.log(props);
        // db.collection('users').doc(this.user.email).get().then(doc => {
        //     doc.data().darkMode ? this.setState({
        //         mode: 'dark'
        //     }) : '';
        //     console.log(this.state.mode)
        // })
        this.loadBoards(this.user);
    }

    loadBoards(user) {
        if (!user) {
            return;
        }
        if (this.boardsSub) {
            this.boardsSub();
        }
        
        this.boardsSub = db.collection('boards').where('userRefs', 'array-contains', user.email).orderBy('label', 'asc').onSnapshot(boardRefs => {
            this.setState({boardRefs: boardRefs.docs.map(boardRef => {
                let data = boardRef.data();
                data.id = boardRef.id;
                return data;
            })});
        });
    }

    componentWillUnmount() {
        this.boardsSub && this.boardsSub();
    }

    render() {
        return (
            <div>
                <BoardsActions />
                <BoardCardCollection boardRefs={this.state.boardRefs} sortMode={this.props.sortMode} />
            </div>
        );
    }
}

export default Boards;