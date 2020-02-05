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


function EditTaskDialog() {
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
                <Button onClick={handleClickOpen}>New task</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>New task</DialogTitle>
                <DialogContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                margin='dense'
                                id='taskTitle'
                                label='Title'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskDescription'
                                label='Description'
                                rows='5'
                                variant='outlined'
                                multiline
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin='dense'
                                id='taskColumns'
                                label='Columns'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin='dense'
                                id='taskDueDate'
                                label='Due date'
                                type='date'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin='dense'
                                id='taskFile'
                                label='Files'
                                type='file'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin='dense'
                                id='taskUsers'
                                label='Users'
                                type='text'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskChecklist'
                                label='Checklist'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskDependencies'
                                label='Dependencies'
                                variant='outlined'
                                fullWidth
                                InputLabelProps={{shrink: true}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                margin='dense'
                                id='taskDependents'
                                label='Dependents'
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
                        Create task
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditTaskDialog;