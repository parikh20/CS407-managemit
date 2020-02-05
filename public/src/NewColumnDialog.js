import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';


function NewColumnDialog() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ButtonGroup size='small'>
                <Button onClick={handleClickOpen}>New column</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>New column</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin='dense'
                                id='columnName'
                                label='Column name'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                     </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color='primary'>
                        Create column
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NewColumnDialog;