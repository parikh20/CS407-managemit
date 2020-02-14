import '../../App.css';
import React from 'react';

import DeleteBoardDialog from './DeleteBoardDialog.js';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField';

import firebase from '../../Firebase';
import { auth, provider } from '../../Firebase.js'

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles(theme => ({
    settingsBody: {
        flexGrow: 1,
        padding: 20,
        paddingRight: 200,
        paddingLeft: 200
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginBottom: 20
    },
    button: {
        marginRight: 5,
        marginLeft: 5
    },
    textField: {
        width: 80 + '%'
    },
    chip: {
        marginRight: 5,
        marginLeft: 5
    }
}));

function BoardSettings(props) {
    const classes = useStyles();

    const db = firebase.firestore();

    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [descriptionHelperText, setDescriptionHelperText] = React.useState('');
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const [errorSnackbar, setErrorSnackbar] = React.useState(false);
    const [inviteEmailError, setInviteEmailError] = React.useState(false);
    const [inviteEmailHelperText, setInviteEmailHelperText] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');


    const regexp = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const handleSettingsSubmit = () => {
        clearState();
        if (!props.board) {
            return; // sanity check
        }
        const name = document.getElementById('boardName').value.trim();
        const description = document.getElementById('boardDescription').value.trim();

        if (name === props.board.label && description === props.board.description) {
            setNameError(true);
            setNameHelperText('Board name must be changed to save!');
            setDescriptionError(true);
            setDescriptionHelperText('Board description must be changed to save!');
        } else if (name === '') {
            setNameError(true);
            setNameHelperText('Board name cannot be empty!');
        } else if (name.length > 50) {
            setNameError(true);
            setNameHelperText('Board name must be less than 50 characters long!');
        } else if (description.length > 150) {
            setDescriptionError(true);
            setDescriptionHelperText('Board description must be less than 150 characters long!');
        } else if (description === '') {
            setDescriptionError(true);
            setDescriptionHelperText('Board description cannot be empty!');
        } else {
            db.collection('boards').doc(props.board.id).update(
                {
                    label: name,
                    description: description
                }
            ).catch(err => {
                setErrorSnackbar(true);
                console.log(err);
                return;
            });
            setSuccessMessage('Successfully saved board details!')
            setSuccessSnackbar(true);
        }
    };

    const inviteUser = (email) => {
        clearState();
        if (email === '') {
            setInviteEmailError(true);
            setInviteEmailHelperText('Email is required');
        } else if (!regexp.test(email)) {
            setInviteEmailError(true);
            setInviteEmailHelperText('Email must be properly formatted');
        } else {
            auth.fetchSignInMethodsForEmail(email).then(result => {
                if (result.length >= 1) {
                    db.collection('boards').doc(props.board.id).update({
                        userRefs: firebase.firestore.FieldValue.arrayUnion(email)
                    }).then(result => {
                        setSuccessSnackbar(true);
                        setSuccessMessage('Successfully invited ' + email + '!');
                    }).catch(err => {
                        console.log(err);
                    });
                } else if (result.length === 0) {
                    setInviteEmailError(true);
                    setInviteEmailHelperText('User does not exist!');
                }
            }).catch(err => {
                console.log(err);
            });
        }
    };

    const deleteUser = (email) => {
        db.collection('boards').doc(props.board.id).update({
            userRefs: firebase.firestore.FieldValue.arrayRemove(email)
        }).then(result => {
            setSuccessSnackbar(true);
            setSuccessMessage('Successfully removed ' + email + '!');
        }).catch(err => {
            console.log(err);
        });
    };

    function clearState() {
        setNameError(false);
        setNameHelperText('');
        setDescriptionError(false);
        setDescriptionHelperText('');
        setSuccessSnackbar(false);
        setErrorSnackbar(false);
        setInviteEmailError(false);
        setInviteEmailHelperText('');
    }
    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorSnackbar(false);
        setSuccessSnackbar(false);
    };

    return (
        <div className={classes.settingsBody}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Board Details</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id='boardName' label='Name' error={nameError} helperText={nameHelperText} variant='outlined' className={classes.textField} InputLabelProps={{shrink: true}} key={props.board.label} defaultValue={props.board.label} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id='boardDescription' label='Description' error={descriptionError} helperText={descriptionHelperText} variant='outlined' className={classes.textField} multiline rows={5} InputLabelProps={{shrink: true}} key={props.board.description} defaultValue={props.board.description} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' color='primary' onClick={handleSettingsSubmit}>Save changes</Button>
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Collaborators</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id='inviteEmail' error={inviteEmailError} helperText={inviteEmailHelperText} label='Add a user by email address' type='email' variant='outlined' className={classes.textField} style={{width: 70 + '%'}}/>
                        <Button variant='contained' color='primary' style={{height: 100 + '%', width: 10 + '%'}} onClick={() => inviteUser(document.getElementById('inviteEmail').value.trim())} >Add user</Button>
                    </Grid>
                    <Grid item xs={12}>
                        {props.board && <>
                            <Chip label={props.board.owner} color='primary' className={classes.chip} />
                        </>}
                        {props.board && props.board.userRefs && <>
                            {props.board.userRefs.filter(userEmail => userEmail !== props.board.owner).map(userEmail => (
                                <Chip label={userEmail} color='primary' key={userEmail} className={classes.chip} variant='outlined' onDelete={() => deleteUser(userEmail)} />
                            ))}
                        </>}
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Here be dragons</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <DeleteBoardDialog />
                    </Grid>
                </Grid>
            </Paper>
            <Snackbar open={successSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='success'>
                    {successMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={errorSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='success'>
                    There was an error saving board details!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default BoardSettings;