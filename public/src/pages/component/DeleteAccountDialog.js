import React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import {Typography } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from '../../Firebase';
import { db } from '../../Firebase';

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    userSettingsBody: {
        flexGrow: 1,
        padding: 20,
        paddingRight: 200,
        paddingLeft: 200
    },
    darkpaper: {
        textAlign: 'left',
        marginTop: 20,
        color: darkTextColor,
        backgroundColor: secondaryDark
    },
    whitepaper: {
        textAlign: 'left',
        marginTop: 20,
        color: black,
        backgroundColor: white
    },
    settingsCard: {
        cursor: 'pointer',
        padding: theme.spacing(2.5),
        '&:hover': {
            background: "#D3D3D3",
        }
    },
    header: {
        padding: theme.spacing(2)
    },
    darkDialog: {
        color: darkTextColor,
        backgroundColor: '#DEE1DD'
    },
    whiteDialog: {
        color: black,
        backgroundColor: white
    }
}));

function DeleteAccountDialog(props) {
    const classes = useStyles();

    const user = JSON.parse(localStorage.getItem('user'));
    const [open, setOpen] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordHelperText, setPasswordHelperText] = React.useState('');
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const [errorSnackbar, setErrorSnackbar] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const mode = localStorage.darkMode

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        cleanState();
        setOpen(false);
    };

    const cleanState = () => {
        setPasswordError(false);
        setPasswordHelperText('');
        setSuccessSnackbar(false);
        setErrorSnackbar(false);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const checkBoards = () => {
        for (const board of props.boards) {
            console.log(board.permissions);
            if (board.owner === user.email && board.userRefs.length > 1) {
                setErrorSnackbar(true);
                setErrorMessage("You must transfer ownership of boards with collaborators or remove all collaborators before you can delete your account")
                return false;
            }
        }
        return true;
    }

    const deleteData = () => {
        const batch = db.batch();
        const path = [];

        const recursiveDelete = firebase.functions().httpsCallable('recursiveDelete');
        for (const board of props.boards) {
            const ref = db.collection('boards').doc(board.id);
            if (board.owner !== user.email) {
                const newPerm = board.permissions;
                delete newPerm[user.email];
                console.log(newPerm);
                batch.update(ref, {"userRefs": firebase.firestore.FieldValue.arrayRemove(user.email)});
                batch.update(ref, {"permissions": newPerm});
            } else if (board.owner === user.email && board.userRefs.length === 1) {
                path.push(ref.path);
            }
        }

        const ref = db.collection('users').doc(user.email);
        path.push(ref.path);
        recursiveDelete({path: path});

        batch.commit().then(res => {

        }).catch(err => {
            console.log(err);
        });
    }

    const handleDelete = () => {
        cleanState();

        if (user.providerData[0].providerId === 'google.com') {
            if (checkBoards() === true) {
                firebase.auth().currentUser.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
                    deleteData();
                    res.user.delete().then(() => {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }).catch(err => {
                        setErrorSnackbar(true);
                        setErrorMessage("Unable to delete account. Please try again later.");
                    });
                });
            }
        } else {
            if (checkBoards() === true) {
                firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(
                    user.email,
                    document.getElementById('password').value
                )).then(res => {
                    deleteData();
                    res.user.delete().then(() => {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }).catch(err => {
                        setErrorSnackbar(true);
                        setErrorMessage("Unable to delete account. Please try again later.");
                    });
                }).catch(error => {
                    setPasswordError(true);
                    setPasswordHelperText('Incorrect password')
                });
            }
        }
    };

    return (
        <>
            <Paper className={classes[`${mode}paper`]} >
                <Typography variant='h5' className={classes.header}>Delete Account</Typography>
                <Divider />
                <Grid container spacing={0} className={classes.settingsCard} >
                    <Grid item xs={12} sm container>
                        <Grid item container direction="column" spacing={2} >
                            <Typography variant='subtitle1'>
                                Delete Your Account
                            </Typography>
                            <Typography color='error' variant="body2">
                                Warning! This action is permanent
                            </Typography>
                        </Grid>
                    </Grid>
                    <Button variant='contained' color='secondary' onClick={handleClickOpen}>Delete</Button>
                </Grid>
                <Divider />
            </Paper>

            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title' className={classes[`${mode}Dialog`]}>Delete Account</DialogTitle>
                <DialogContent className={classes[`${mode}Dialog`]}>
                    < Typography variant='subtitle1'>
                        Reauthenticate to delete your account
                    </Typography>
                    <Typography color='error' variant="body2">
                                Warning! This action is permanent and cannot be undone under any circumstances!
                    </Typography>
                    { user.providerData[0].providerId === 'password' &&
                        <div>
                            <TextField error={passwordError} helperText={passwordHelperText} autoFocus margin='dense' id='password' label='Password' type='password' variant='outlined' fullWidth />
                        </div>
                    }
                    <Divider style={{marginTop: 5}} />
                </DialogContent>
                <DialogActions className={classes[`${mode}Dialog`]}>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button color='primary' onClick={handleDelete} >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={successSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='success'>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={errorSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='error'>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default DeleteAccountDialog;