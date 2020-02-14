import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

import { db } from '../../Firebase';

function NewColumnDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');

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

    const handleSubmit = async () => {
        const columnName = document.getElementById('columnName').value.trim();

        clearState();

        if (columnName === '') {
            setNameError(true);
            setNameHelperText('Column name is required');
        } else if (columnName.length > 50) {
            setNameError(true);
            setNameHelperText('Column name must be less than 50 characters');
        } else if (columnNames.includes(columnName)) {
            setNameError(true);
            setNameHelperText('Column name is already in use');
        } else {
            setOpen(false);

            db.runTransaction(async (t) => {
                let columnGroupRef = await db.collection('boards').doc(props.boardRef.id).collection('columnGroups').doc(props.columnGroupRef.id);
                let colRef = await columnGroupRef.collection('columns').add({
                    label: columnName,
                    taskRefs: [],        
                });

                let columnOrder = (await columnGroupRef.get()).data().columnOrder;
                columnOrder.push(colRef.id);

                await columnGroupRef.update({
                    'columnOrder': columnOrder
                });
            });
        }
    };
    
    const clearState = () => {
        setNameError(false);
        setNameHelperText('');
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
                                error={nameError}
                                helperText={nameHelperText}
                            />
                        </Grid>
                     </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color='primary'>
                        Create column
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default NewColumnDialog;