import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Divider from '@material-ui/core/Divider';


function EditColumnDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div style={{display: 'inline'}}>
            <IconButton
                edge='end'
                aria-label='edit column'
                color='inherit'
                onClick={handleClickOpen}>
                <EditIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Edit column</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin='dense'
                        id='columnName'
                        label='Rename column'
                        variant='outlined'
                        fullWidth
                    />
                    <Divider style={{margin: 10}} />
                    <DialogContentText>
                        To delete the column, type the name of the column to confirm deletion.<br /><br />Warning: this cannot be undone.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin='dense'
                        id='columnDeleteConfirmation'
                        label='Column name'
                        variant='outlined'
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color='secondary'>
                        Delete column
                    </Button>
                    <Button onClick={handleClose} color='primary'>
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditColumnDialog;