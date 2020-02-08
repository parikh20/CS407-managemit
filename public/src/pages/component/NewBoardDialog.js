import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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

    const handleSubmit = () => {
        const name = document.getElementById('newBoardName').value;
        const description = document.getElementById('newBoardDescription').value;

        clearState();

        if (name.trim() === '') {
            setNameError(true);
            setNameHelperText('Board name is required');
        } else {
            // actually create the board here. description is not validated as it is not required

            setOpen(false);
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