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

import { makeStyles } from '@material-ui/core/styles';

import { db } from '../../Firebase';

const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: white
    },
    darkGrid: {
        padding: '10px 10px 0px 10px',
        color: darkTextColor,
        backgroundColor: primaryDark
    },
    whiteGrid: {
        padding: '10px 10px 0px 10px',
        color: black,
        backgroundColor: white
    },
    darkButton: {
        color: darkTextColor,
        backgroundColor: secondaryDark
    },
    whiteButton: {
        color: black,
        backgroundColor: white
    },
    darkLink: {
        color: darkTextColor,
        backgroundColor: primaryDark
    },
    whiteLink: {
        color: black,
        backgroundColor: white
    }
}));

function BoardActions(props) {
    const user = JSON.parse(localStorage.getItem('user')); // temp fix. auth.currentUser doesn't work if we navigate to this page directly, or refresh
    const classes = useStyles();
    console.log(props.darkMode)
    const mode = props.darkMode

    return (
        <Grid container className={classes[`${mode}Grid`]}>
            <div style={{flexGrow: 1}}>
                <BoardBreadcrumbs board={props.board} columnGroupRef={props.columnGroupRef} darkMode={mode}/>
            </div>
            {props.board && (
                <ButtonGroup size='small' className={classes[`${mode}Button`]}>
                    <EditTaskDialog darkMode={mode} boardRef={props.boardRef} board={props.board} columns={props.columns} allColGroups={props.allColGroups} allCols={props.allCols} taskRefs={props.taskRefs} fileRefs={props.fileRefs} />
                    <NewColumnDialog darkMode={mode} boardRef={props.boardRef} columnGroupRef={props.columnGroupRef} columns={props.columns}/>
                    <SelectViewDialog darkMode={mode} boardRef={props.boardRef} board={props.board} allColGroups={props.allColGroups} allCols={props.allCols} />
                    <NewViewDialog darkMode={mode} boardRef={props.boardRef} board={props.board} allColGroups={props.allColGroups} />
                    <EditViewDialog darkMode={mode} boardRef={props.boardRef} board={props.board} allColGroups={props.allColGroups} allCols={props.allCols} taskRefs={props.taskRefs} currentGroupId={props.currentGroupId} />
                    <ButtonGroup size='small'>
                        <Button href={'/board/' + props.boardRef.id + '/calendar' } className={classes[`${mode}Button`]}>Calendar</Button>
                    </ButtonGroup>
                    <BoardUsersDialog boardRef={props.boardRef} board={props.board} className={classes[`${mode}Button`]}/>
                    <ButtonGroup size='small'>
                        <Button href={'/board/' + props.boardRef.id + '/documents'} className={classes[`${mode}Button`]}>Documents</Button>
                    </ButtonGroup>
                    <ButtonGroup size='small'>
                        <Button href={'/board/' + props.boardRef.id + '/history'} className={classes[`${mode}Button`]}>History</Button>
                    </ButtonGroup>
                    {user && props.board.permissions && (props.board.owner === user.email || props.board.permissions[user.email].isAdmin === true) && (
                        <ButtonGroup size='small'>
                            <Button href={'/board/' + props.boardRef.id + '/settings'} className={classes[`${mode}Button`]}>Settings</Button>
                        </ButtonGroup>
                    )}
                </ButtonGroup>
            )}
        </Grid>
    );
}

export default BoardActions;