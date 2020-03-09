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
import firebase from '../../Firebase';

function EditColumnDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [deleteDisable, setDeleteDisable] = React.useState(true);
    
    const user = JSON.parse(localStorage.getItem('user'));

    const columnNames = [];
    for (let column of props.columns) {
        columnNames.push(column.label);
    }

    const handleClickOpen = () => {
        clearState();
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
            }).then(result => {
                db.collection('boards').doc(props.boardRef.id).collection('history').add(
                    {
                        user: user.email,
                        colName: columnName,
                        action: 5,
                        timestamp: new Date()
                    }
                ).catch(err => {
                    console.log("Error logging edit column: " + err);
                });
            });
        }
    };

    const handleSubmitDelete = () => {
        const verifyName = document.getElementById('columnDeleteConfirmation').value;
        if (verifyName === props.column.label) {
            setOpen(false);

            db.runTransaction(async (t) => {
                const colGroup = await db.collection('boards').doc(props.boardRef.id).collection('columnGroups').doc(props.columnGroupRef.id);
                let columnOrder = (await colGroup.get()).data().columnOrder.filter(colRef => colRef !== props.column.id);

                props.column.taskRefs.forEach(async (taskId) => {
                    const taskRef = db.collection('boards').doc(props.boardRef.id).collection('tasks').doc(taskId);
                    let columnRefs = (await taskRef.get()).data().columnRefs;

                    // If this task is only in this column, delete it. Otherwise, just remove this column from its list.
                    if (columnRefs.length === 1) {
                        taskRef.delete();
                    } else {
                        taskRef.update({
                            columnRefs: columnRefs.filter(columnRef => columnRef !== props.column.id)
                        });
                    }
                });
                
                await colGroup.collection('columns').doc(props.column.id).delete();

                await colGroup.update({
                    'columnOrder': columnOrder
                });
            }).then(result => {
                db.collection('boards').doc(props.boardRef.id).collection('history').add(
                    {
                        user: user.email,
                        colName: props.column.label,
                        action: 6,
                        timestamp: new Date()
                    }
                ).catch(err => {
                    console.log("Error logging delete column: " + err);
                });
            });
        }
    };
    
    const clearState = () => {
        setNameError(false);
        setNameHelperText('');
    };

    const inputListener = (event) => {
        if (event.target.value === props.column.label) {
            setDeleteDisable(false);
        } else {
            setDeleteDisable(true);
        }
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
                        Type the name of the column to confirm deletion.<br /><br />Warning: this cannot be undone. Any tasks associated with only this column will be lost.
                    </DialogContentText>
                    <TextField
                        margin='dense'
                        id='columnDeleteConfirmation'
                        label='Column name confirmation'
                        variant='outlined'
                        fullWidth
                        color='secondary'
                        onChange={inputListener}
                        InputLabelProps={{shrink: true}}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmitDelete} disabled={deleteDisable} color='secondary'>
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