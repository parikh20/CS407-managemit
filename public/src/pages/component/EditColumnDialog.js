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

import { db } from '../../Firebase';


function EditColumnDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    
    const columnNames = [];
    for (let column of props.columns) {
        columnNames.push(column.label);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmitChanges = () => {
        const columnName = document.getElementById('columnName').value.trim();

        clearState();

        if (columnName === '') {
            setNameError(true);
            setNameHelperText('Column name is required');
        } else if (columnName.length > 50) {
            setNameError(true);
            setNameHelperText('Column name must be less than 50 characters');
        } else if (columnNames.includes(columnName) && columnName !== props.column.label) {
            setNameError(true);
            setNameHelperText('Column name is already in use');
        } else {
            setOpen(false);

            db.collection('boards').doc(props.boardRef.id).collection('columnGroups').doc(props.columnGroupRef.id).collection('columns').doc(props.column.id).update({
                label: columnName
            });
        }
    };
    
    const clearState = () => {
        setNameError(false);
        setNameHelperText('');
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
                        InputLabelProps={{shrink: true}} 
                        error={nameError}
                        helperText={nameHelperText}
                        defaultValue={props.column.label}
                    />
                    <Divider style={{margin: 10}} />
                    <DialogContentText>
                        To delete the column, type the name of the column to confirm deletion.<br /><br />Warning: this cannot be undone.
                    </DialogContentText>
                    <TextField
                        margin='dense'
                        id='columnDeleteConfirmation'
                        label='Column name'
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
                        Delete column
                    </Button>
                    <Button onClick={handleSubmitChanges} color='primary'>
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditColumnDialog;