import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import BoardsActions from '../BoardsActions';
import BoardCardCollection from '../BoardCardCollection';

const useStyles = makeStyles(theme => ({
}));

function Boards(props) {
    const classes = useStyles();
    return (
        <div>
            <BoardsActions />
            <BoardCardCollection />
        </div>
    );
}

export default Boards;