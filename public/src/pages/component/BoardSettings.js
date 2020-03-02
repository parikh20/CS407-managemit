import '../../App.css';
import React from 'react';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Switch from '@material-ui/core/Switch';

import DeleteBoardDialog from './DeleteBoardDialog';
import TransferBoardDialog from './TransferBoardDialog';

import firebase from '../../Firebase';
import { db, auth } from '../../Firebase';

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

    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [descriptionHelperText, setDescriptionHelperText] = React.useState('');
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const [errorSnackbar, setErrorSnackbar] = React.useState(false);
    const [inviteEmailError, setInviteEmailError] = React.useState(false);
    const [inviteEmailHelperText, setInviteEmailHelperText] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    const regexp = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    const handleSettingsSubmit = () => {
        clearState();
        if (!props.board) {
            return; // sanity check
        }
        const name = document.getElementById('boardName').value.trim();
        const description = document.getElementById('boardDescription').value.trim();

        if (name === '') {
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
            ).then(result => {
                db.collection('boards').doc(props.board.id).collection('history').add(
                    {
                        user: user.email,
                        action: 1,
                        timestamp: firebase.database.ServerValue
                    }
                ).catch(err => {
                    console.log("Error logging board update: " + err);
                });
            }).catch(err => {
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
                        document.getElementById('inviteEmail').value = ''
                        setSuccessSnackbar(true);
                        setSuccessMessage('Successfully invited ' + email + '!');
                    }).catch(err => {
                        console.log(err);
                    });
                } else if (result.length === 0) {
                    setInviteEmailError(true);
                    setInviteEmailHelperText('User does not exist!');
                }
            }).then(result => {
                db.collection('boards').doc(props.board.id).collection('history').add(
                    {
                        user: user.email,
                        user2: email,
                        action: 2,
                        timestamp: firebase.database.ServerValue
                    }
                ).catch(err => {
                    console.log("Error logging inviting user: " + err);
                });
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
            db.collection('boards').doc(props.board.id).collection('history').add(
                {
                    user: user.email,
                    user2: email,
                    action: 3,
                    timestamp: firebase.database.ServerValue
                }
            ).catch(err => {
                console.log("Error logging removing user: " + err);
            });
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
                        <TextField id='boardDescription' label='Description (optional)' error={descriptionError} helperText={descriptionHelperText} variant='outlined' className={classes.textField} multiline rows={5} InputLabelProps={{shrink: true}} key={props.board.description} defaultValue={props.board.description} />
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
                        <TableContainer style={{width: '80%', marginRight: 'auto', marginLeft: 'auto'}}>
                            <Table size='small'>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell align='right'>Can edit</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Owner</TableCell>
                                        <TableCell>
                                            {props.board && <>
                                                <Chip label={props.board.owner} color='primary' className={classes.chip} />
                                            </>}
                                        </TableCell>
                                        <TableCell align='right'>
                                            <Switch checked={true} disabled={true} color='primary' />
                                        </TableCell>
                                    </TableRow>
                                    {props.board && props.board.userRefs && <>
                                        {props.board.userRefs.filter(userEmail => userEmail !== props.board.owner).map(userEmail => <>
                                            <TableRow>
                                                <TableCell>Member</TableCell>
                                                <TableCell>
                                                    <Chip label={userEmail} color='primary' key={userEmail} className={classes.chip} variant='outlined' onDelete={() => deleteUser(userEmail)} />
                                                </TableCell>
                                                <TableCell align='right'>
                                                    <Switch checked={true} color='primary' />
                                                </TableCell>
                                            </TableRow>
                                        </>)}
                                    </>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Here be dragons</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <DeleteBoardDialog board={props.board} />
                        <TransferBoardDialog board={props.board} />
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