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
import { Typography, Divider } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';

import firebase from '../../Firebase';

const useStyles = makeStyles(theme => ({
    settingsCard: {
        cursor: 'pointer',
        padding: theme.spacing(2.5),
        '&:hover': {
            background: "#D3D3D3",
        }
    },
}));

function EditEmailDialog() {
    const classes = useStyles();
    const history = useHistory();

    const user = JSON.parse(localStorage.getItem('user'));
    const regexp = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [open, setOpen] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordHelperText, setPasswordHelperText] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailHelperText, setEmailHelperText] = React.useState('');
    const [email, setEmail] = React.useState(user.email);

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
        setEmailError(false);
        setEmailHelperText('');
    };

    const changeEmail = (email) => {
        cleanState();
        const oldEmail = user.email;
        if (email.length === 0) {
            setEmailError(true);
            setEmailHelperText('Email cannot be empty');
        } else if (!regexp.test(email)) {
            setEmailError(true);
            setEmailHelperText('Email must be properly formatted')
        } else {
                const password = document.getElementById('password').value
                if (password.length === 0) {
                    setPasswordError(true);
                    setPasswordHelperText('Password cannot be empty');
                } else if (password.length < 6) {
                    setPasswordError(true);
                    setPasswordHelperText('Password must be at least 6 characters long');
                } else if (password.length > 128) {
                    setPasswordError(true);
                    setPasswordHelperText('Password must be less than 128 characters long');
                } else {
                    firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(
                        user.email,
                        password
                    )).then(res => {
                        const changeEmailFunction = firebase.functions().httpsCallable('changeEmail');
                        changeEmailFunction({oldEmail: oldEmail, newEmail: email, uid: user.uid}).then(result => {
                            console.log(result.data)
                            localStorage.removeItem('user');
                            history.push('/login');
                            handleClose();
                        });
                    }).catch(error => {
                        setPasswordError(true);
                        setPasswordHelperText('Incorrect password')
                    });
                }
            }
    }

    return (
        <div>
            <Grid container spacing={0} className={classes.settingsCard} onClick={handleClickOpen} >
                <Grid item xs={12} sm container>
                    <Grid item container direction="column" spacing={2} >
                        <Typography variant='subtitle1'>
                            Change Email
                        </Typography>
                        <Typography variant="body2">
                            {email}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item style={{marginTop: 10}}>
                    <ArrowIcon></ArrowIcon>
                </Grid>
            </Grid>
            <Divider />

            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Change your email</DialogTitle>
                <DialogContent>
                    { user.providerData[0].providerId === 'password' &&
                        <div>
                            <DialogContentText>Enter your password for reauthentication</DialogContentText>
                            <TextField error={passwordError} helperText={passwordHelperText} autoFocus margin='dense' id='password' label='Password' type='password' variant='outlined' fullWidth />
                        </div>
                    }
                    <Divider style={{marginTop: 5}} />
                    <TextField error={emailError} helperText={emailHelperText} autoFocus margin='dense' id='email' label='Email' type='string' variant='outlined' defaultValue={email} fullWidth >
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button color='primary' onClick={() => changeEmail(document.getElementById("email").value)} >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditEmailDialog;