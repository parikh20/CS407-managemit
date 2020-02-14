import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {auth, db} from '../../Firebase';

const defaultColumns = ["Backlog","In Progress","Reviewing","Complete"];

const createBoard = async (name, description) => {
    let defaultColumnPromises = [];
    
    return new Promise((res,rej) => {
        db.collection("boards").add({
            owner: auth.currentUser.email,
            label: name,
            description: description,
            defaultColumnGroup: "",
            taskRefs: [],
            userRefs: [auth.currentUser.email]
        }).then((boardRef) => {
            return boardRef.collection("columnGroups").add({
                label: "Default Group"
            });
        }).then(async (columnGroupRef) => {
            let columnRefs = [];
            for (const title of defaultColumns) {
                let colRef = await columnGroupRef.collection("columns").add({
                    label: title,
                    taskRefs: [],        
                });
                columnRefs.push(colRef.id);
            }
            await columnGroupRef.set({
                columnOrder: columnRefs
            }, {merge: true});
        }).then(() => {
            res();
        }).catch((err) => {
            rej(err);
        })
    });
};


function NewBoardDialog() {
    const [open, setOpen] = React.useState(false);
    
    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [descriptionHelperText, setDescriptionHelperText] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = (name,description) => {
        setOpen(false);
    };
    
    const handleSubmit = async () => {
        const name = document.getElementById('newBoardName').value.trim();
        const description = document.getElementById('newBoardDescription').value.trim();
        
        clearState();
        
        if (name === '') {
            setNameError(true);
            setNameHelperText('Board name is required');
        } else if (name.length > 50) {
            setNameError(true);
            setNameHelperText('Board name must be less than 50 characters long')
        } else if (description.length > 150) {
            setDescriptionError(true);
            setDescriptionHelperText('Board description must be greater than 150 characters long')
        } else {
            try {
                setOpen(false);
                createBoard(name,description).catch((err) => {console.error(err)});
            } catch (err) {
                setOpen(true);
                setNameError(true);
                setNameHelperText('Board could not be created!');
            }
        }
    };
    
    const clearState = () => {
        setNameError(false);
        setNameHelperText('');
        setDescriptionError(false);
        setDescriptionHelperText('');
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
                    error={descriptionError}
                    helperText={descriptionHelperText}
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