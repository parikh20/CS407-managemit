import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { db } from '../../Firebase';


function DeleteBoardDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [deleteDisable, setDeleteDisable] = React.useState(true);
    const history = useHistory();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (boardName) => {
        setOpen(false);
        if (boardName === props.board.label) {
            const boardId = props.board.id;
            const boardRef = db.collection("boards").doc(boardId);
            boardRef.delete().then(function() {
                history.push("/boards")
            });
        }
    };

    const inputListener = (event) => {
        if (event.target.value === props.board.label) {
            setDeleteDisable(false);
        } else {
            setDeleteDisable(true);
        }
    };

    return (
        <div>
            <Button onClick={handleClickOpen} variant='contained' color='secondary'>Delete board</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Delete board</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Type the board name to confirm deletion of the board.<br /><br />
                    Warning: this cannot be undone.
                    </DialogContentText>
                    <TextField
                        onChange={inputListener}
                        autoFocus
                        margin='dense'
                        id='confirmDeleteBoard'
                        label='Board name'
                        variant='outlined'
                        fullWidth
                        color='secondary'
                        InputLabelProps={{shrink: true}} 
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={() =>
                        handleClose(document.getElementById("confirmDeleteBoard").value)
                        } color='secondary' disabled={deleteDisable}>
                        Delete board
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeleteBoardDialog;