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

const createBoard = (name, description) => {
    let defaultColumnPromises = [];
    
    return new Promise((res,rej) => {
        db.collection("boards").add({
            owner: auth.currentUser.uid,
            label: name,
            description: description,
            defaultColumnGroup: "",
            taskRefs: [],
            userRefs: [auth.currentUser.uid]
        }).then((boardRef) => {
            return boardRef.collection("columnGroups").add({
                label: "Default Group"
            });
        }).then((columnGroupRef) => {
            defaultColumns.forEach((title) => {
                defaultColumnPromises.push(columnGroupRef.collection("columns").add({
                    label: title,
                    taskRefs: [],        
                }));
            });
            return Promise.all(defaultColumnPromises);
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
    
    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = (name,description) => {
        setOpen(false);
    };
    
    const handleSubmit = async () => {
        const name = document.getElementById('newBoardName').value;
        const description = document.getElementById('newBoardDescription').value;
        
        clearState();
        
        if (name.trim() === '') {
            setNameError(true);
            setNameHelperText('Board name is required');
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