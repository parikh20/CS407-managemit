import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import BoardActions from '../BoardActions';
import ColumnGroup from '../ColumnGroup';

const useStyles = makeStyles(theme => ({
}));

function Boards(props) {
    const classes = useStyles();
    return (
        <div>
            <BoardActions/>
            <ColumnGroup />
        </div>
    );
}

export default Boards;