import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import firebase from '../../Firebase';


const createBoard = async (name, description, user) => {
    const userId = user.uid;

    const db = firebase.firestore();
    try {

        // This is not a great way to do this. We should probably be using a transaction
        // here instead. That's a TODO
        let col1Ref = await db.collection('columns').doc();
        await col1Ref.set({
            label: 'Backlog',
            taskRefs: [],
        });
        let col2Ref = await db.collection('columns').doc();
        await col2Ref.set({
            label: 'In Progress',
            taskRefs: []
        });
        let col3Ref = await db.collection('columns').doc();
        await col3Ref.set({
            label: 'Reviewing',
            taskRefs: []
        });
        let col4Ref = await db.collection('columns').doc();
        await col4Ref.set({
            label: 'Complete',
            taskRefs: []
        });
        let colGroupRef = await db.collection('columnGroups').doc();
        await colGroupRef.set({
            columnRefs: [col1Ref.id, col2Ref.id, col3Ref.id, col4Ref.id]
        });
        let boardRef = await db.collection('boards').doc().set({
            owner: userId,
            label: name,
            description: description,
            columnGroups: [colGroupRef.id],
            defaultColumnGroup: colGroupRef.id,
            taskRefs: [],
            userRefs: [userId]
        });
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    } catch (err) {
        return new Promise((resolve, reject) => {
            reject(false);
        });
    }

};


function NewBoardDialog() {
    const [open, setOpen] = React.useState(false);

    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        const name = document.getElementById('newBoardName').value;
        const description = document.getElementById('newBoardDescription').value;
        const user = JSON.parse(localStorage.getItem('user'));

        clearState();

        if (name.trim() === '') {
            setNameError(true);
            setNameHelperText('Board name is required');
        } else {
            try {
                let result = await createBoard(name, description, user);
                setOpen(false);
            } catch (err) {
                setNameError(true);
                setNameHelperText('Board could not be created!');
            }
        }
    };

    const clearState = () => {
        setNameError(false);
        setNameHelperText('');
    };

    return (
        <div>
            <ButtonGroup size='small'>
                <Button onClick={handleClickOpen}>New board</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>New board</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Enter a name for your new board.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        id='newBoardName'
                        label='Board name'
                        variant='outlined'
                        fullWidth
                        error={nameError}
                        helperText={nameHelperText}
                    />
                    <TextField
                        margin='dense'
                        id='newBoardDescription'
                        label='Board description (optional)'
                        rows='5'
                        variant='outlined'
                        multiline
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color='primary'>
                        Create board
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NewBoardDialog;