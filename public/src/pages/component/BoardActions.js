import React from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';

import BoardBreadcrumbs from './BoardBreadcrumbs';
import EditTaskDialog from './EditTaskDialog';
import NewColumnDialog from './NewColumnDialog';
import SelectViewDialog from './SelectViewDialog'

function BoardActions(props) {
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <Grid container style={{padding: '10px 10px 0px 10px'}}>
            <div style={{flexGrow: 1}}>
                <BoardBreadcrumbs board={props.board} />
            </div>
            {props.board && (
                <ButtonGroup size='small'>
                    <EditTaskDialog />
                    <NewColumnDialog boardRef={props.boardRef} columnGroupRef={props.columnGroupRef} columns={props.columns} />
                    <Button>New view</Button>
                    <SelectViewDialog />
                    <Button>View calendar</Button>
                    <Button href={'/board/' + props.boardRef.id + '/history'}>View history</Button>
                    {props.board.owner === user.email && (
                        <Button href={'/board/' + props.boardRef.id + '/settings'}>Settings</Button>
                    )}
                </ButtonGroup>
            )}
        </Grid>
    );
}

export default BoardActions;