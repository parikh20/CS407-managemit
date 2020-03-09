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
import { Typography, Divider, InputLabel } from '@material-ui/core';
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

function EditPhoneNumberDialog() {
    const classes = useStyles();

    const user = JSON.parse(localStorage.getItem('user'));
    const regexp = /^(([0-9]{10}))$/;
    const [open, setOpen] = React.useState(false);
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordHelperText, setPasswordHelperText] = React.useState('');
    const [phoneError, setPhoneError] = React.useState(false);
    const [phoneHelperText, setPhoneHelperText] = React.useState('');
    const [phone, setPhone] = React.useState(user.phoneNumber);

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
        setPhoneError(false);
        setPhoneHelperText('');
    }

    const changePhone = (phone) => {
        cleanState();

        if (phone.length == 0) {
            setPhoneError(true);
            setPhoneHelperText('Phone number cannot be empty');
        } else if (!regexp.test(phone)) {
            setPhoneError(true);
            setPhoneHelperText('Phone number must be a 10 digit string')
        } else {
            phone = '+1' + phone

            if (user.providerData[0].providerId === 'google.com') {
                firebase.auth().currentUser.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
                    res.user.updateProfile({
                        phoneNumber: phone
                    }).then(() => {
                        user.phoneNumber = phone;
                        setPhone(phone);
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
                            phoneNumber: phone
                        }).then(resu => {
                            user.phoneNumber = phone;
                            setPhone(phone);
                            localStorage.setItem('user', JSON.stringify(user))
                            handleClose();
                        }).catch(error => {
                            console.log(error);
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
                            Phone
                        </Typography>
                        <Typography variant="body2">
                            {phone}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item style={{marginTop: 10}}>
                    <ArrowIcon></ArrowIcon>
                </Grid>
            </Grid>
            <Divider />

            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Change your phone number</DialogTitle>
                <DialogContent>
                    { user.providerData[0].providerId === 'password' &&
                        <div>
                            <DialogContentText>Enter your password for reauthentication</DialogContentText>
                            <TextField error={passwordError} helperText={passwordHelperText} autoFocus margin='dense' id='password' label='Password' type='password' variant='outlined' fullWidth />
                        </div>
                    }
                    <Divider style={{marginTop: 5}} />
                    <TextField error={phoneError} helperText={phoneHelperText} autoFocus margin='dense' id='phone' label='Phone Number' type='string' variant='outlined' fullWidth >
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button color='primary' onClick={() => changePhone(document.getElementById("phone").value)} >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default EditPhoneNumberDialog;