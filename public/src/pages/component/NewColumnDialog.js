import React from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import LoadingAnimation from './LoadingAnimation';

import { db } from '../../Firebase';
import { dispatchUserNotifications } from '../../Notifications';

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function NewColumnDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [showLoadingAnimation, setShowLoadingAnimation] = React.useState(false);
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);

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
            setShowLoadingAnimation(true);

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
            }).then(result => {
                db.collection('boards').doc(props.boardRef.id).collection('history').add(
                    {
                        user: user.email,
                        colName: columnName,
                        columnGroupName: props.columnGroupRef.data().label,
                        action: 4,
                        timestamp: new Date()
                    }
                ).catch(err => {
                    console.log("Error logging new column: " + err);
                });

                const emailText = 'Column "' + columnName + '" created in the view "' + props.columnGroupRef.data().label + '"';
                dispatchUserNotifications(props.boardRef, user, emailText, {
                    user: user.email,
                    userIsOwner: props.boardRef.data().owner === user.email,
                    colName: columnName,
                    columnGroupName: props.columnGroupRef.data().label,
                    action: 4,
                    timestamp: new Date(),
                    board: props.boardRef.data().label,
                    boardId: props.boardRef.id,
                    unread: true
                });

                setShowLoadingAnimation(false);
                setSuccessSnackbar(true);
                setOpen(false);
            });
        }
    };
    
    const clearState = () => {
        setNameError(false);
        setShowLoadingAnimation(false);
        setSuccessSnackbar(false);
        setNameHelperText('');
    };
    
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSuccessSnackbar(false);
    };

    return (
        <>
            <ButtonGroup size='small'>
                <Button {...props} onClick={handleClickOpen}>New column</Button>
            </ButtonGroup>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>New column</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter a name for the new column.
                    </DialogContentText>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextField
                                autoFocus
                                id='columnName'
                                label='Column name'
                                variant='outlined'
                                fullWidth
                                margin='dense'
                                InputLabelProps={{shrink: true}}
                                error={nameError}
                                helperText={nameHelperText}
                            />
                        </Grid>
                    </Grid>
                    {showLoadingAnimation && (
                        <LoadingAnimation />
                    )}
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

            <Snackbar open={successSnackbar} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} autoHideDuration={6000} severity='success'>
                    New column created
                </Alert>
            </Snackbar>
        </>
    );
}

export default NewColumnDialog;