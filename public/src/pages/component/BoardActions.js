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
import EditViewDialog from './EditViewDialog';

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
                        <EditTaskDialog boardRef={props.boardRef} board={props.board} columns={props.columns} allColGroups={props.allColGroups} allCols={props.allCols} taskRefs={props.taskRefs} />
                        <NewColumnDialog boardRef={props.boardRef} columnGroupRef={props.columnGroupRef} columns={props.columns}/>
                    </>}
                    <SelectViewDialog boardRef={props.boardRef} board={props.board} allColGroups={props.allColGroups} allCols={props.allCols} />
                    {!props.lockFunctionality && <>
                        <NewViewDialog boardRef={props.boardRef} board={props.board} allColGroups={props.allColGroups} />
                        <EditViewDialog boardRef={props.boardRef} board={props.board} allColGroups={props.allColGroups} allCols={props.allCols} taskRefs={props.taskRefs} currentGroupId={props.currentGroupId} />
                    </>}
                    <ButtonGroup size='small'>
                        <Button href={'/board/' + props.boardRef.id + '/calendar'}>Calendar</Button>
                    </ButtonGroup>
                    <BoardUsersDialog boardRef={props.boardRef} board={props.board} />
                    <ButtonGroup size='small'>
                        <Button href={'/board/' + props.boardRef.id + '/documents'}>Documents</Button>
                    </ButtonGroup>
                    <ButtonGroup size='small'>
                        <Button href={'/board/' + props.boardRef.id + '/history'}>History</Button>
                    </ButtonGroup>
                    {user && props.board.permissions && (props.board.owner === user.email || props.board.permissions[user.email].isAdmin === true) && (
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