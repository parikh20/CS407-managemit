import React from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import NewBoardDialog from './NewBoardDialog.js';

function BoardsActions(props) {
    return (
        <Grid container style={{padding: '10px 10px 0px 10px'}}>
            <div style={{flexGrow: 1}}>
                <Breadcrumbs aria-label='breadcrumbs'>
                    <Typography color='textPrimary'>
                        Boards
                    </Typography>
                </Breadcrumbs>
            </div>
            <NewBoardDialog />
        </Grid>
    );
}

export default BoardsActions;