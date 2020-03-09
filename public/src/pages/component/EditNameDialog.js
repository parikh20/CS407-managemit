import React from 'react';

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

function EditNameDialog() {
    const classes = useStyles();

    const user = JSON.parse(localStorage.getItem('user'));

    const [open, setOpen] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordHelperText, setPasswordHelperText] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [name, setName] = React.useState(user.displayName);

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
        setNameError(false);
        setNameHelperText('');
    }

    const changeName = (name) => {
        cleanState();

        if (name.length > 50) {
            setNameError(true);
            setNameHelperText('Name cannot be greater than 50 characters long')
        } else if (name.length == 0) {
            setNameError(true);
            setNameHelperText('Name cannot be empty');
        } else {
            if (user.providerData[0].providerId === 'google.com') {
                firebase.auth().currentUser.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
                    res.user.updateProfile({
                        displayName: name
                    }).then(() => {
                        user.displayName = name;
                        setName(name);
                        localStorage.setItem('user', JSON.stringify(user))
                        handleClose();
                    }).catch(error => {
                        console.log(error);
                    });
                });
            } else {
                const password = document.getElementById('password').value
                if (password.length == 0) {
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
                        res.user.updateProfile({
                            displayName: name
                        }).then(() => {
                            user.displayName = name;
                            setName(name);
                            localStorage.setItem('user', JSON.stringify(user))
                            handleClose();
                        }).catch(error => {
                        });
                    }).catch(error => {
                        setPasswordError(true);
                        setPasswordHelperText('Incorrect password')
                    });
                }
            }
        }
    }

    return (
        <div>
            <Grid container spacing={0} className={classes.settingsCard} onClick={handleClickOpen} >
                <Grid item xs={12} sm container>
                    <Grid item container direction="column" spacing={2} >
                        <Typography variant='subtitle1'>
                            Name
                        </Typography>
                        <Typography variant="body2">
                            {name}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item style={{marginTop: 10}}>
                    <ArrowIcon></ArrowIcon>
                </Grid>
            </Grid>
            <Divider />

            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Change your name</DialogTitle>
                <DialogContent>
                    { user.providerData[0].providerId === 'password' &&
                        <div>
                            <DialogContentText>Enter your password for reauthentication</DialogContentText>
                            <TextField error={passwordError} helperText={passwordHelperText} autoFocus margin='dense' id='password' label='Password' type='password' variant='outlined' fullWidth />
                        </div>
                    }
                    <Divider style={{marginTop: 5}} />
                    <TextField error={nameError} helperText={nameHelperText} autoFocus margin='dense' id='name' label='Name' type='string' variant='outlined' fullWidth />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button color='primary' onClick={() => changeName(document.getElementById("name").value)} >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditNameDialog;