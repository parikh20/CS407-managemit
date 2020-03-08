import React, {useRef} from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import { makeStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import { Avatar, Typography } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';

import { auth } from '../../Firebase.js'
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

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

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function AddPhotoDialog() {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const inputFile = useRef(null)

    const user = JSON.parse(localStorage.getItem('user'));

    const handleClick = () => {
        inputFile.current.click()
    };

    const handleChange = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const file = e.target.files[0];
        const filePath = user.uid + '/profilePicture/' + file.name
        const storageRef = firebase.storage().ref(filePath);
        storageRef.put(file).then(() => {
            storageRef.getDownloadURL().then(url => {
                if (user.providerData[0].providerId === 'google.com') {
                    firebase.auth().currentUser.reauthenticateWithPopup(new firebase.auth.GoogleAuthProvider()).then(res => {
                        res.user.updateProfile({
                            photoURL: url
                        }).then(() => {
                            user.photoURL = url;
                            localStorage.setItem('user', JSON.stringify(user))
                        }).catch(error => {
                            console.log(error);
                        });
                    });
                }
                
            }).catch(error => {
                console.log(error)
            });
        });
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Grid container spacing={0} className={classes.settingsCard} onClick={handleClick}>
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
                    <Avatar src={user.photoURL}></Avatar>
                </Grid>
            </Grid>
            <input type='file' accept='image/*' id='file' ref={inputFile} onChange={handleChange} style={{display: 'none'}}></input>
        </div>
    );
}

export default AddPhotoDialog;