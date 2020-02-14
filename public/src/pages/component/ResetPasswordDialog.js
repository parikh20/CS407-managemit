import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { auth } from '../../Firebase.js'
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function ResetPasswordDialog() {
    const [open, setOpen] = React.useState(false);
    const [resetPasswordEmailError, setResetPasswordEmailError] = React.useState(false);
    const [resetPasswordEmailHelperText, setResetPasswordEmailHelperText] = React.useState('');
    const [resetPasswordSuccessSnackbar, setResetPasswordSuccessSnackbar] = React.useState(false);
    const regexp = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setResetPasswordSuccessSnackbar(false);
    };

    function sendPasswordResetEmail(email) {
        clearState();
        if (email === '') {
            setResetPasswordEmailError(true);
            setResetPasswordEmailHelperText('Email is required');
        } else if (!regexp.test(email)) {
            setResetPasswordEmailError(true);
            setResetPasswordEmailHelperText('Email must be properly formatted');
        } else {
            auth.sendPasswordResetEmail(email).then(result => {
                handleClose();
            }).catch(error => {

            });
            setResetPasswordSuccessSnackbar(true);
        }
    }

    const clearState = () => {
        setResetPasswordEmailError(false);
        setResetPasswordEmailHelperText('');
        setResetPasswordSuccessSnackbar(false);
    }

    return (
        <div>
            <Button onClick={handleClickOpen}>Forgot password?</Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Reset password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Enter your email. If the email is already associated with an account, you will recieve an email with a new password.
                    </DialogContentText>
                    <TextField
                        error={resetPasswordEmailError}
                        helperText={resetPasswordEmailHelperText}
                        autoFocus
                        margin='dense'
                        id='forgotPasswordEmail'
                        label='Email'
                        type='email'
                        variant='outlined'
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => sendPasswordResetEmail(document.getElementById("forgotPasswordEmail").value)} color='primary'>
                        Reset password
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={resetPasswordSuccessSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='success'>
                    If an account with this email exists, an email to reset the password has been sent
                </Alert>
            </Snackbar>
        </div>
    );
}

export default ResetPasswordDialog;