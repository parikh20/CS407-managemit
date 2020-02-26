import React from 'react';

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';

import BoardBreadcrumbs from './BoardBreadcrumbs';
import EditTaskDialog from './EditTaskDialog';
import NewColumnDialog from './NewColumnDialog';
import SelectViewDialog from './SelectViewDialog'
import NewViewDialog from './NewViewDialog';
import BoardUsersDialog from './BoardUsersDialog';

function BoardActions(props) {
    const user = JSON.parse(localStorage.getItem('user')); // temp fix. auth.currentUser doesn't work if we navigate to this page directly, or refresh

    return (
        <Grid container style={{padding: '10px 10px 0px 10px'}}>
            <div style={{flexGrow: 1}}>
                <BoardBreadcrumbs board={props.board} />
            </div>
            {props.board && (
                <ButtonGroup size='small'>
                    {!props.lockFunctionality && <>
                        <EditTaskDialog boardRef={props.boardRef} board={props.board} columns={props.columns} allColGroups={props.allColGroups} allCols={props.allCols} />
                        <NewColumnDialog boardRef={props.boardRef} columnGroupRef={props.columnGroupRef} columns={props.columns}/>
                        <NewViewDialog boardRef={props.boardRef} board={props.board} allColGroups={props.allColGroups} />
                    </>}
                    <SelectViewDialog boardRef={props.boardRef} board={props.board} allColGroups={props.allColGroups} allCols={props.allCols} />
                    <ButtonGroup size='small'>
                        <Button>Calendar</Button>
                    </ButtonGroup>
                    <BoardUsersDialog boardRef={props.boardRef} board={props.board} />
                    <ButtonGroup size='small'>
                        <Button href={'/board/' + props.boardRef.id + '/history'}>History</Button>
                    </ButtonGroup>
                    {props.board.owner === user.email && (
                        <ButtonGroup size='small'>
                            <Button href={'/board/' + props.boardRef.id + '/settings'}>Settings</Button>
                        </ButtonGroup>
                    )}
                </ButtonGroup>
            )}
        </Grid>
    );
}

export default BoardActions;