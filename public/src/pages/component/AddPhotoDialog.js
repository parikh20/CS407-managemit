import React, {useRef} from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { Avatar, Typography, Divider } from '@material-ui/core';

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

function AddPhotoDialog() {
    const classes = useStyles();

    const user = JSON.parse(localStorage.getItem('user'));

    const [URL, setURL] = React.useState(user.photoURL);
    const [fileName, setFileName] = React.useState('No file selected');
    const [open, setOpen] = React.useState(false);
    const [disabledSubmit, setDisabledSubmit] = React.useState(true);
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordHelperText, setPasswordHelperText] = React.useState('');
    const inputFile = useRef(null)

    const openUploadWindow = () => {
        inputFile.current.click()
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        cleanState();
        setFileName('No file selected');
        setDisabledSubmit(true);
        setOpen(false);
    };

    const handleChange = (e) => {
        console.log(URL)
        e.stopPropagation();
        e.preventDefault();
        const file = e.target.files[0];
        setFileName(file.name)
        setDisabledSubmit(false);
    }

    const cleanState = () => {
        setPasswordError(false);
        setPasswordHelperText('');
    }

    const handleUpload = (e) => {
        cleanState();

        const file = document.getElementById('file').files[0]
        const filePath = user.uid + '/profilePicture/' + file.name
        const storageRef = firebase.storage().ref(filePath);
        if (user.providerData[0].providerId !== 'google.com' && user.photoURL !== null) {
            const oldStorageRef = firebase.storage().refFromURL(user.photoURL).then(res => {
                oldStorageRef.delete().then(res => {
                    console.log(res);
                }).catch(err => {
                    console.log(err);
                });
            }).catch(err => {
                console.log(err);
            });
    }   

        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                if (user.providerData[0].providerId === 'google.com') {
                    firebase.auth().currentUser.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
                        res.user.updateProfile({
                            photoURL: url
                        }).then(() => {
                            user.photoURL = url;
                            setURL(url);
                            localStorage.setItem('user', JSON.stringify(user))
                            handleClose();
                        }).catch(error => {
                            console.log(error);
                        });
                    }).catch(err => {
                        console.log(err);
                    });
                } else {
                    firebase.auth().currentUser.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(
                        user.email,
                        document.getElementById('password').value
                    )).then(res => {
                        res.user.updateProfile({
                            photoURL: url
                        }).then(() => {
                            user.photoURL = url;
                            setURL(url);
                            localStorage.setItem('user', JSON.stringify(user))
                            handleClose();
                        }).catch(error => {
                        });
                    }).catch(error => {
                        setPasswordError(true);
                        setPasswordHelperText('Incorrect password')
                    });
                }
            }).catch(error => {
                console.log(error)
            });
        });
    };            

    return (
        <div>
            <Grid container spacing={0} className={classes.settingsCard} onClick={handleClickOpen}>
                <Grid item xs={12} sm container>
                    <Grid item container direction="column" spacing={2} >
                        <Typography variant='subtitle1'>
                            Add a photo
                        </Typography>
                        <Typography variant="body2">
                            Add a photo to your profile
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item>
                    <Avatar src={URL}></Avatar>
                </Grid>
            </Grid>
            <Divider />
            <Dialog open={open} onClose={handleClose} aria-labelledby='form-dialog-title'>
                <DialogTitle id='form-dialog-title'>Choose a photo</DialogTitle>
                <DialogContent>
                    { user.providerData[0].providerId === 'password' &&
                        <div>
                            <DialogContentText>Enter your password for reauthentication</DialogContentText>
                            <TextField error={passwordError} helperText={passwordHelperText} autoFocus margin='dense' id='password' label='Password' type='password' variant='outlined' fullWidth />
                        </div>
                    }
                    <Grid container spacing={0} >
                        <Grid item xs={6} sm container>
                            <input type='file' accept='image/*' id='file' ref={inputFile} onChange={handleChange} style={{display: 'None'}} />
                            <Button 
                            color='primary' variant='contained' style={{marginTop: 5}} onClick={openUploadWindow}>
                            Choose file
                            </Button>   
                            <Typography variant='caption' style={{marginLeft: 10, marginTop: 13}}>{fileName}</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button color='primary' onClick={handleUpload} disabled={disabledSubmit} >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default AddPhotoDialog;