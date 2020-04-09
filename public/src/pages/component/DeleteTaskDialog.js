import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { db } from '../../Firebase';
import { dispatchUserNotifications } from '../../Notifications';

function DeleteTaskDialog(props) {
    const [open, setOpen] = React.useState(false);

    const user = JSON.parse(localStorage.getItem('user'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDelete = () => {
        db.runTransaction(async (t) => {
            props.boardRef.ref.collection('tasks').doc(props.taskRef.id).delete();

            props.boardRef.ref.collection('tasks').where('dependents', 'array-contains', props.taskRef.id).get().then(taskRefs => {
                taskRefs.docs.forEach(taskRef => {
                    taskRef.ref.update({
                        dependents: taskRef.data().dependents.filter(item => item !== props.taskRef.id)
                    });
                });
            });
            props.boardRef.ref.collection('tasks').where('dependencies', 'array-contains', props.taskRef.id).get().then(taskRefs => {
                taskRefs.docs.forEach(taskRef => {
                    taskRef.ref.update({
                        dependencies: taskRef.data().dependencies.filter(item => item !== props.taskRef.id)
                    });
                });
            });
        }).then(result => {
            const emailText = 'Task "' + props.task.title + '" deleted';
            db.collection('boards').doc(props.boardRef.id).collection('history').add(
                {
                    user: user.email,
                    taskName: props.task.title,
                    action: 8,
                    timestamp: new Date(),
                    actionText: emailText
                }
            ).catch(err => {
                console.log("Error logging delete task: " + err);
            });

            dispatchUserNotifications(props.boardRef.data(), user, emailText, {
                user: user.email,
                userIsOwner: props.boardRef.data().owner === user.email,
                action: 8,
                timestamp: new Date(),
                board: props.boardRef.data().label,
                boardId: props.boardRef.id,
                taskName: props.task.title,
                unread: true
            });
        });
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Button color='secondary' onClick={handleClickOpen}>
                Delete
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
            >
                <DialogTitle id='alert-dialog-title'>Delete task</DialogTitle>
                <DialogContent>
                    <DialogContentText id='alert-dialog-description'>
                        Are you sure you want to delete the task?<br /><br />Warning: this cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color='secondary'>
                        Delete task
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}

export default DeleteTaskDialog;