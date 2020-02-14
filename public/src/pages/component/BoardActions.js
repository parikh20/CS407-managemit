import React from 'react';

import BoardBreadcrumbs from './BoardBreadcrumbs.js';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';

import EditTaskDialog from './EditTaskDialog.js';
import NewColumnDialog from './NewColumnDialog.js';

function BoardActions(props) {
    return (
        <Grid container style={{padding: '10px 10px 0px 10px'}}>
            <div style={{flexGrow: 1}}>
                <BoardBreadcrumbs board={props.board} />
            </div>
            <ButtonGroup size='small'>
                <EditTaskDialog />
                <NewColumnDialog board={props.board} columnGroup={props.columnGroup} columns={props.columns} />
                <Button>Select view</Button>
                <Button>View history</Button>
                <Button href={'/board/' + props.board.id + '/settings'}>Settings</Button>
            </ButtonGroup>
        </Grid>
    );
}

export default BoardActions;