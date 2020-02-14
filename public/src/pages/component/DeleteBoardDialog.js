import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


function DeleteBoardDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
                    <Button onClick={handleClose} color='secondary'>
                        Delete board
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeleteBoardDialog;