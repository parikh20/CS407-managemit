import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AttachmentIcon from '@material-ui/icons/Attachment';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Menu from '@material-ui/core/Menu';

import EditTaskDialog from './EditTaskDialog';
import ConnectedTasksDialog from './ConnectedTasksDialog';
import DeleteTaskDialog from './DeleteTaskDialog';

import dateFormat from 'dateformat';

import { db, cache, addPointsToUser } from '../../Firebase';
import firebase from '../../Firebase';
import { dispatchUserNotifications } from '../../Notifications';
import { makeStyles } from '@material-ui/core/styles';

const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: white
    },
    darkCard: {
        marginBottom: 5,
        color: darkTextColor,
        backgroundColor: secondaryDark
    },
    whiteCard: {
        marginBottom: 5,
        color: black,
        backgroundColor: white
    },
    darkButton: {
        color: darkTextColor,
        backgroundColor: '#DEE1DD'
    },
    whiteButton: {
        color: black,
        backgroundColor: white
    }
}));

function TaskListing(props) {
    const [open, setOpen] = React.useState(false);
    const [connectionMenuEl, setConnectionMenuEl] = React.useState(null);
    const [commentError, setCommentError] = React.useState(false);
    const [commentHelperText, setCommentHelperText] = React.useState('');
    const user = JSON.parse(localStorage.getItem('user'));
    const classes = useStyles();
    const mode = props.darkMode

    let fileListings = {};
    if (props.fileRefs) {
        for (const fileRef of props.fileRefs) {
            fileListings[fileRef.id] = fileRef.data();
        }
    }

    let allTasksById = {};
    if (props.taskRefs && Array.isArray(props.taskRefs)) {
        for (const taskRef of props.taskRefs) {
            allTasksById[taskRef.id] = {
                ref: taskRef,
                data: taskRef.data(),
                id: taskRef.id
            };
        }
    }
    
    if (props.taskCompleted === null) {

    }

    const handleClickOpen = () => {
        clearState();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleMenuOpen = event => {
        setConnectionMenuEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setConnectionMenuEl(null);
    };

    const handleChecklistItemStatusChange = (event, index) => {
        let checklistCopy = props.task.checklist.slice(0);
        checklistCopy[index].completed = event.target.checked;
        props.boardRef.ref.collection('tasks').doc(props.taskRef.id).update({
            checklist: checklistCopy
        });
    };

    const handleCompletedChange = (event) => {
        props.task.completed = event.target.checked;
        if(props.task.completed) {
            const associatedUsers = new Set(props.task.users);
            associatedUsers.add(user.email)
            associatedUsers.forEach((user) => {
                addPointsToUser(props.boardRef.ref.id, user, Number.parseInt(props.task.points), false)
            });
        }
        props.boardRef.ref.collection('tasks').doc(props.taskRef.id).update({
            completed: event.target.checked
        });
    };

    const handlePostComment = () => {
        const commentText = document.getElementById('taskComment').value.trim();

        clearState();

        if (commentText === '') {
            setCommentError(true);
            setCommentHelperText('Comment is required');
        } else if (commentText.length > 1000) {
            setCommentError(true);
            setCommentHelperText('Comment must be less than 100 characters');
        } else {
            props.boardRef.ref.collection('tasks').doc(props.taskRef.id).collection('comments').add({
                user: user.email,
                commentText: commentText,
                taskName: props.task.title, 
                timestamp: new Date()
            }).then(result => {
                const emailText = 'Comment posted on task "' + props.task.title + '":\n"' + commentText + '"';
                db.collection('boards').doc(props.boardRef.id).collection('history').add(
                    {
                        user: user.email,
                        taskName: props.task.title,
                        commentText: commentText,
                        action: 9,
                        timestamp: new Date(),
                        actionText: emailText
                    }
                ).catch(err => {
                    console.log("Error logging delete task: " + err);
                });
                dispatchUserNotifications(props.boardRef.data(), user, emailText, {
                    user: user.email,
                    userIsOwner: props.boardRef.data().owner === user.email,
                    action: 9,
                    timestamp: new Date(),
                    board: props.boardRef.data().label,
                    boardId: props.boardRef.id,
                    taskName: props.task.title,
                    commentText: commentText,
                    unread: true
                });
            });
            document.getElementById('taskComment').value = '';
        }
    };

    const handleDeleteComment = (commentRef) => {
        const commentText = commentRef.data().commentText;
        const user2 = commentRef.data().user;
        db.runTransaction(async (t) => {
            props.boardRef.ref.collection('tasks').doc(props.taskRef.id).collection('comments').doc(commentRef.id).delete();
        }).then(result => {
            const emailText = 'Comment deleted on task "' + props.task.title + '":\n"' + commentText + '"';
            db.collection('boards').doc(props.boardRef.id).collection('history').add(
                {
                    user: user.email,
                    commentText: commentText,
                    user2: user2,
                    taskName: props.task.title, 
                    action: 11,
                    timestamp: new Date(),
                    actionText: emailText
                }
            ).catch(err => {
                console.log("Error logging delete comment: " + err);
            });
            dispatchUserNotifications(props.boardRef.data(), user, emailText, {
                user: user.email,
                userIsOwner: props.boardRef.data().owner === user.email,
                action: 11,
                timestamp: new Date(),
                board: props.boardRef.data().label,
                boardId: props.boardRef.id,
                taskName: props.task.title,
                commentText: commentText,
                unread: true
            });
        });
    };

    const handleDocumentClick = rowData => {
        const storageRef = firebase.storage().ref(rowData.filePath);
        storageRef.getDownloadURL().then(url => {
            window.open(url, '_blank');
        });
    };

    const clearState = () => {
        setCommentError(false);
        setCommentHelperText('');
    };

    let elements = [];
    elements = document.getElementsByClassName('taskListing');
    for (let i = 0; i < elements.length; i++) {
        let content = elements[i].innerText;
        if (content.includes("Complete")) {
            elements[i].classList.add('complete');
        } else {
            elements[i].classList.remove('complete');
        }
    }

    return (
        <Card variant='outlined' className={classes[`${mode}Card`]}>
            <CardContent onClick={handleClickOpen} style={{cursor: 'pointer'}} className='taskListing'>
                <Typography variant='h6' component='h2'>
                    {props.task.title.length < 30 ? props.task.title : props.task.title.slice(0, 30) + '...'}
                </Typography>
                <Typography variant='body2' component='p'>
                    {props.task.desc.length < 300 ? props.task.desc : props.task.desc.slice(0, 300) + '...'}
                </Typography>
                <Typography variant='body2' component='p'>
                    {props.task.completed ? "Task Complete" : "Task Incomplete"}
                </Typography>
                <Typography variant='body2' component='p'>
                    {props.task.date != null ? 'Due ' + dateFormat(props.task.date.toDate(), 'mm/dd/yyyy') : ''}
                </Typography>
            </CardContent>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title' className={classes[`${mode}Button`]}>{props.task.title}</DialogTitle>
                <DialogContent className={classes[`${mode}Button`]}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <Typography variant='h6' component='h2'>
                                Description
                            </Typography>
                            <Typography variant='body2' component='p' style={{whiteSpace: 'pre-line'}}>
                                {props.task.desc !== '' ? props.task.desc : '(No description provided)'}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h6' component='h2'>
                                Columns
                            </Typography>
                            {props.task.columnRefs.map(columnId => 
                                <Chip key={columnId} label={props.allColumnNames[columnId]} size='small' style={{margin: 3 + 'px'}} />
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h6' component='p'>
                                Points
                            </Typography>
                            <Typography variant='body2' component='p' style={{whiteSpace: 'pre-line'}}>
                                {props.task.points ? props.task.points + " points" : 0 + " points"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h6' component='h2'>
                                Due Date
                            </Typography>
                            <Typography variant='body2' component='p'>
                                {props.task.date === null && (
                                    '(No due date)'
                                )}
                                {props.task.date !== null && <React.Fragment>
                                    {dateFormat(props.task.date.toDate(), 'mm/dd/yyyy')}
                                    <Button
                                        variant='outlined'
                                        size='small'
                                        color='primary'
                                        style={{float: 'right'}}
                                        href={'/board/' + props.boardRef.id + '/calendar/' + props.task.date.toDate().getMonth() + '/' + props.task.date.toDate().getDate() + '/' + props.task.date.toDate().getFullYear()}
                                    >
                                        View on calendar
                                    </Button>
                                </React.Fragment>}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h6' component='h2'>
                                Status
                            </Typography>
                            <FormControlLabel
                                control={<Checkbox checked={props.task.completed || false} onClick={(event) => handleCompletedChange(event)} />}
                                label={"Completed"}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h6' component='h2'>
                                Users
                            </Typography>
                            {props.task.users.length === 0 && (
                                <Typography variant='body2' component='p'>
                                    (No users assigned to task)
                                </Typography>
                            )}
                            {props.task.users.length > 0 && props.task.users.map(user =>
                                <Chip key={user} label={user} color='primary' size='small' style={{margin: 3 + 'px'}} variant={user !== props.boardRef.data().owner ? 'outlined' : 'default'} />
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Documents
                            </Typography>
                            {(!Array.isArray(props.task.fileRefs) || props.task.fileRefs.length === 0) && (
                                <Typography variant='body2' component='p'>
                                    (No files attached to task)
                                </Typography>
                            )}
                            {Array.isArray(props.task.fileRefs) && props.task.fileRefs.length > 0 && (
                                <List component='nav'>
                                    {props.task.fileRefs.map(fileRef => (
                                        <ListItem button key={fileRef} onClick={() => handleDocumentClick(fileListings[fileRef])}>
                                            <ListItemIcon>
                                                <AttachmentIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={fileListings[fileRef] ? fileListings[fileRef].fileName: ''} />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Checklist
                            </Typography>
                            {(!props.task.checklist || !Array.isArray(props.task.checklist) || props.task.checklist.length === 0) && (
                                <Typography variant='body2' component='p'>
                                    (No checklist items assigned to task)
                                </Typography>
                            )}
                            {props.task.checklist && Array.isArray(props.task.checklist) && props.task.checklist.length > 0 && (
                                <FormControl component='fieldset'>
                                    <FormGroup>
                                        {props.task.checklist.map((checklistItem, index) => (
                                            <FormControlLabel
                                                key={index}
                                                control={<Checkbox checked={checklistItem.completed} onClick={(event) => handleChecklistItemStatusChange(event, index)} />}
                                                label={checklistItem.text}
                                            />
                                        ))}
                                    </FormGroup>
                                </FormControl>
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='h6' component='h2'>
                                Comments
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskComment'
                                label='New comment'
                                rows='3'
                                variant='outlined'
                                multiline
                                fullWidth
                                InputLabelProps={{shrink: true}}
                                error={commentError}
                                helperText={commentHelperText}
                            />
                            <Button color='primary' variant='outlined' style={{float: 'right'}} onClick={handlePostComment}>Post comment</Button>
                        </Grid>
                        {props.taskCommentRefs[props.taskRef.id] && props.taskCommentRefs[props.taskRef.id].map(commentRef => (
                            <Grid item xs={12}>
                                <Typography variant='body2' component='p'>
                                    <Chip key={commentRef.id} label={commentRef.data().user} color='primary' size='small' style={{marginRight: 5 + 'px'}} variant={commentRef.data().user !== props.boardRef.data().owner ? 'outlined' : 'default'} />
                                    said at {dateFormat(commentRef.data().timestamp.toDate(), 'hh:MM')} on {dateFormat(commentRef.data().timestamp.toDate(), 'mm/dd/yyyy')}:
                                </Typography>
                                <Typography variant='body2' component='p' style={{marginLeft: 10 + 'px', marginTop: 5 + 'px', whiteSpace: 'pre-line'}}>
                                    {commentRef.data().commentText}
                                </Typography>
                                {(commentRef.data().user === user.email || props.boardRef.data().permissions[user.email].isAdmin) && (
                                    <Button size='small' color='secondary' style={{marginLeft: 10 + 'px'}} onClick={() => handleDeleteComment(commentRef)}>
                                        Delete
                                    </Button>
                                )}
                            </Grid>
                        ))}
                     </Grid>
                </DialogContent>
                <DialogActions className={classes[`${mode}Button`]}>
                    <Button aria-controls='connections-menu' aria-haspopup='true' onClick={handleMenuOpen}>
                        View connections
                    </Button>
                    <Menu
                        id='connections-menu'
                        anchorEl={connectionMenuEl}
                        keepMounted
                        open={Boolean(connectionMenuEl)}
                        onClose={handleMenuClose}
                    >

                        <ConnectedTasksDialog
                            boardRef={props.boardRef}
                            taskRef={props.taskRef}
                            allTasksById={allTasksById}
                            showAll={false}
                        />
                        <ConnectedTasksDialog
                            boardRef={props.boardRef}
                            taskRef={props.taskRef}
                            allTasksById={allTasksById}
                            showAll={true}
                        />
                    </Menu>
                    <DeleteTaskDialog
                        taskRef={props.taskRef}
                        boardRef={props.boardRef}
                        task={props.task}
                    />
                    <EditTaskDialog
                        buttonSize='medium'
                        buttonVariant='default'
                        buttonText='Edit'
                        buttonDisabled={props.task.completed ? true : false}
                        buttonConfirmText='Save changes'
                        boardRef={props.boardRef}
                        board={props.board}
                        columns={props.columns}
                        allColGroups={props.allColGroups}
                        allCols={props.allCols}
                        fileRefs={props.fileRefs}
                        existingTask={props.task}
                        existingTaskRef={props.taskRef}
                        taskRefs={props.taskRefs}
                    />
                    <Button onClick={handleClose} color='primary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
    }

export default TaskListing;