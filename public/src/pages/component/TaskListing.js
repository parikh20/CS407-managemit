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

import EditTaskDialog from './EditTaskDialog';

import dateFormat from 'dateformat';

import { db } from '../../Firebase';
import firebase from '../../Firebase';

function TaskListing(props) {
    const [open, setOpen] = React.useState(false);
    const [commentError, setCommentError] = React.useState(false);
    const [commentHelperText, setCommentHelperText] = React.useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    let fileListings = {};
    if (props.fileRefs) {
        for (const fileRef of props.fileRefs) {
            fileListings[fileRef.id] = fileRef.data();
        }
    }

    const handleClickOpen = () => {
        clearState();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        db.runTransaction(async (t) => {
            props.boardRef.ref.collection('tasks').doc(props.taskRef.id).delete();
        }).then(result => {
            db.collection('boards').doc(props.boardRef.id).collection('history').add(
                {
                    user: user.email,
                    taskName: props.task.title,
                    action: 8,
                    timestamp: new Date()
                }
            ).catch(err => {
                console.log("Error logging delete task: " + err);
            });
        });
        setOpen(false);
    };

    const handleChecklistItemStatusChange = (event, index) => {
        let checklistCopy = props.task.checklist.slice(0);
        checklistCopy[index].completed = event.target.checked;
        props.boardRef.ref.collection('tasks').doc(props.taskRef.id).update({
            checklist: checklistCopy
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
                db.collection('boards').doc(props.boardRef.id).collection('history').add(
                    {
                        user: user.email,
                        taskName: props.task.title,
                        commentText: commentText,
                        action: 9,
                        timestamp: new Date()
                    }
                ).catch(err => {
                    console.log("Error logging delete task: " + err);
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
            db.collection('boards').doc(props.boardRef.id).collection('history').add(
                {
                    user: user.email,
                    commentText: commentText,
                    user2: user2,
                    taskName: props.task.title, 
                    action: 11,
                    timestamp: new Date()
                }
            ).catch(err => {
                console.log("Error logging delete comment: " + err);
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

    return (
        <Card variant='outlined' style={{marginBottom: 5}}>
            <CardContent onClick={handleClickOpen} style={{cursor: 'pointer'}} className='taskListing'>
                <Typography variant='h6' component='h2'>
                    {props.task.title.length < 30 ? props.task.title : props.task.title.slice(0, 30) + '...'}
                </Typography>
                <Typography variant='body2' component='p'>
                    {props.task.desc.length < 300 ? props.task.desc : props.task.desc.slice(0, 300) + '...'}
                </Typography>
            </CardContent>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>{props.task.title}</DialogTitle>
                <DialogContent>
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
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant='h6' component='h2'>
                                        Columns
                                    </Typography>
                                    {props.task.columnRefs.map(columnId => 
                                        <Chip key={columnId} label={props.allColumnNames[columnId]} size='small' style={{margin: 3 + 'px'}} />
                                    )}
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Typography variant='h6' component='h2'>
                                        Due Date
                                    </Typography>
                                    <Typography variant='body2' component='p'>
                                        {props.task.date === null && (
                                            '(No due date)'
                                        )}
                                        {props.task.date !== null && (<>
                                            {dateFormat(props.task.date.toDate(), 'mm/dd/yyyy')}
                                            <Button
                                                variant='outlined'
                                                size='small'
                                                color='primary'
                                                style={{float: 'right'}}
                                                href={'/board/' + props.boardRef.id + '/calendar'}
                                            >
                                                View on calendar
                                            </Button>
                                        </>)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
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
                            </Grid>
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
                <DialogActions>
                    <Button onClick={handleClose}>
                        View connected tasks
                    </Button>
                    {!props.lockFunctionality && <>
                        <Button onClick={handleDelete} color='secondary'>
                            Delete
                        </Button>
                        <EditTaskDialog
                            buttonSize='medium'
                            buttonVariant='default'
                            buttonText='Edit'
                            buttonConfirmText='Save changes'
                            boardRef={props.boardRef}
                            board={props.board}
                            columns={props.columns}
                            allColGroups={props.allColGroups}
                            allCols={props.allCols} 
                            askRefs={props.taskRefs}
                            fileRefs={props.fileRefs}
                            existingTask={props.task}
                        />
                    </>}
                    <Button onClick={handleClose} color='primary'>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
    }

export default TaskListing;