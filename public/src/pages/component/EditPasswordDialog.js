import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { Typography, Divider, InputLabel } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert';

import firebase from '../../Firebase';

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles(theme => ({
    settingsCard: {
        cursor: 'pointer',
        padding: theme.spacing(2.5),
        '&:hover': {
            background: "#D3D3D3",
        }
    },
}));

function EditPasswordDialog() {
    const classes = useStyles();
    const history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));
    const regexp = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [open, setOpen] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordHelperText, setPasswordHelperText] = React.useState('');
    const [newPasswordError, setNewPasswordError] = React.useState(false);
    const [newPasswordHelperText, setNewPasswordHelperText] = React.useState('');
    const [verifyPasswordError, setVerifyPasswordError] = React.useState(false);
    const [verifyPasswordHelperText, setVerifyPasswordHelperText] = React.useState('');
    const [errorSnackbar, setErrorSnackbar] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

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
        setNewPasswordError(false);
        setNewPasswordHelperText('');
        setVerifyPasswordError(false);
        setVerifyPasswordHelperText('');
        setErrorSnackbar(false);
        setErrorMessage('');
        setSuccessSnackbar(false);
        setSuccessMessage('');
    };

    const changePassword = (password, newPassword, verifyPassword) => {
        cleanState();

                if (password.length == 0) {
                    setPasswordError(true);
                    setPasswordHelperText('Password cannot be empty');
                } else if (password.length < 6) {
                    setPasswordError(true);
                    setPasswordHelperText('Password must be at least 6 characters long');
                } else if (password.length > 128) {
                    setPasswordError(true);
                    setPasswordHelperText('Password must be less than 128 characters long');
                } else if (newPassword.length == 0) { 
                    setNewPasswordError(true);
                    setNewPasswordHelperText('New password cannot be empty');
                } else if (verifyPassword.length == 0) {
                    setVerifyPasswordError(true);
                    setVerifyPasswordHelperText('Verify password cannot be empty');
                } else if (newPassword !== verifyPassword) {
                    setNewPasswordError(true);
                    setNewPasswordHelperText('Passwords do not match');
                    setVerifyPasswordError(true);
                    setVerifyPasswordHelperText('Passwords do not match');
                } else if (newPassword.length < 6) {
                    setNewPasswordError(true);
                    setNewPasswordHelperText('New password cannot be less than 6 characters long');
                } else if (newPassword.length > 128) {
                    setNewPasswordError(true);
                    setNewPasswordHelperText('New password cannot be greater than 128 characters long');
                } else {
                    firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(
                        user.email,
                        password
                    )).then(res => {
                        res.user.updatePassword(newPassword).then(result => {
                            setSuccessSnackbar(true);
                            setSuccessMessage('Password successfully changed')
                            handleClose();
                            localStorage.removeItem('user');
                            history.push('/login');
                        }).catch(error => {
                            setErrorSnackbar(true);
                            setErrorMessage(error.message);
                        });
                    }).catch(error => {
                        setPasswordError(true);
                        setPasswordHelperText('Incorrect password');
                        setErrorSnackbar(true);
                        setErrorMessage(error.message);
                    });
                }
    }

    return (
        <div>
            <Grid container spacing={0} className={classes.settingsCard} onClick={handleClickOpen} >
                <Grid item xs={12} sm container>
                    <Grid item container direction="column" spacing={2} >
                        <Typography variant='subtitle1'>
                            Change Password
                        </Typography>
                        <Typography variant="body2">
                            Change your password
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item style={{marginTop: 10}}>
                    <ArrowIcon></ArrowIcon>
                </Grid>
            </Grid>
            <Divider />
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Change your password</DialogTitle>
                <DialogContent>
                    { user.providerData[0].providerId === 'password' &&
                        <div>
                            <DialogContentText>Enter your password for reauthentication</DialogContentText>
                            <TextField error={passwordError} helperText={passwordHelperText} autoFocus margin='dense' id='password' label='Current Password' type='password' variant='outlined' fullWidth />
                        </div>
                    }
                    <Divider style={{marginTop: 5}} />
                    <TextField error={newPasswordError} helperText={newPasswordHelperText} autoFocus margin='dense' id='newPassword' label='New Password' type='password' variant='outlined' fullWidth />
                    <TextField error={verifyPasswordError} helperText={verifyPasswordHelperText} autoFocus margin='dense' id='verifyPassword' label='Verify Password' type='password' variant='outlined' fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button color='primary' onClick={() => changePassword(document.getElementById("password").value, document.getElementById('newPassword').value, document.getElementById('verifyPassword').value)} >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={errorSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='error'>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={successSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='success'>
                    {successMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default EditPasswordDialog;