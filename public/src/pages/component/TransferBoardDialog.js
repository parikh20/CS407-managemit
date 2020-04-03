import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import { db } from '../../Firebase';
import { dispatchUserNotifications } from '../../Notifications';


function TransferBoardDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [transferDisable, setTransferDisable] = React.useState(true);
    const [selectedUser, setSelectedUser] = React.useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    let users = [];
    if (props.board && props.board.userRefs) {
        users = props.board.userRefs.filter(email => email !== props.board.owner && props.board.permissions[email].isAdmin);
    }

    const handleClickOpen = () => {
        setTransferDisable(true);
        setSelectedUser('');
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelectUser = (email) => {
        if (email === selectedUser) {
            setSelectedUser('');
        } else {
            setSelectedUser(email);
        }
        const input = document.getElementById('confirmTransferBoard').value;
        if (input === props.board.label && email !== '' && email !== selectedUser) {
            setTransferDisable(false);
        } else {
            setTransferDisable(true);
        }
    }

    const handleTransferBoard = () => {
        db.collection('boards').doc(props.board.id).update({
            owner: selectedUser
        }).then(result => {
            db.collection('boards').doc(props.board.id).collection('history').add(
                {
                    user: user.email,
                    user2: selectedUser,
                    action: 10,
                    timestamp: new Date()
                }
            ).catch(err => {
                console.log("Error logging board update: " + err);
            });

            const emailText = 'Ownership transferred from ' + user.email + ' to ' + selectedUser;
            dispatchUserNotifications(props.board, user, emailText, {
                user: user.email,
                userIsOwner: props.board.owner === user.email,
                action: 10,
                timestamp: new Date(),
                board: props.board.label,
                boardId: props.board.id,
                user2: selectedUser,
                unread: true
            });
        });
    }

    const inputListener = () => {
        const input = document.getElementById('confirmTransferBoard').value;
        if (input === props.board.label && selectedUser !== '') {
            setTransferDisable(false);
        } else {
            setTransferDisable(true);
        }
    };

    return (
        <>
            <Button onClick={handleClickOpen} variant='contained' color='secondary' style={{margin: 5 + 'px'}}>Transfer ownership</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Transfer ownership</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Select the new owner of the board, and type the board name to confirm the transfer. The new owner of the board must already be an administrator.
                    <br /><br />
                    Warning: this cannot be undone, but the new owner of the board can transfer ownership back.
                    </DialogContentText>
                    {users.map(email => (
                        <Chip
                            key={email}
                            label={email}
                            color='primary'
                            variant={selectedUser === email ? 'default' : 'outlined'}
                            style={{marginLeft: 5 + 'px', marginRight: 5 + 'px'}}
                            onClick={() => handleSelectUser(email)}
                            />
                    ))}
                    {users.length === 0 && (
                        <Typography variant='p' color='secondary'>
                            This board has no administrators. You must add an administrator before the board ownership can be transferred.
                        </Typography>
                    )}
                    <TextField
                        onChange={inputListener}
                        autoFocus
                        margin='dense'
                        id='confirmTransferBoard'
                        label='Board name'
                        variant='outlined'
                        fullWidth
                        color='secondary'
                        InputLabelProps={{shrink: true}}
                        style={{marginTop: 15 + 'px'}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        color='secondary'
                        disabled={transferDisable}
                        onClick={handleTransferBoard}
                    >
                        Transfer ownership
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default TransferBoardDialog;