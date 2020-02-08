import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


function NewBoardDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>New board</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>New board</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Enter a name and description for your new board.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        id='newBoardName'
                        label='Board name'
                        variant='outlined'
                        fullWidth
                    />
                    <TextField
                        margin='dense'
                        id='newBoardDescription'
                        label='Board description'
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
                    <Button onClick={handleClose} color='primary'>
                        Create board
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NewBoardDialog;