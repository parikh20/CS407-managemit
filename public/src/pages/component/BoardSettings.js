import '../../App.css';
import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import DeleteBoardDialog from './DeleteBoardDialog';
import TransferBoardDialog from './TransferBoardDialog';

import { db, auth, addPointsToUser } from '../../Firebase';
import { dispatchUserNotifications } from '../../Notifications';
import firebase from '../../Firebase';

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
    },
    settingsCard: {
        cursor: 'pointer',
        padding: theme.spacing(2.5),
        '&:hover': {
            background: "#D3D3D3",
        }
    },
    apiCard: {
        padding: theme.spacing(2.5),
    },
    typography: {
        color: 'black'
    }
}));

function BoardSettings(props) {
    const classes = useStyles();
    const history = useHistory();

    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [descriptionHelperText, setDescriptionHelperText] = React.useState('');
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const [errorSnackbar, setErrorSnackbar] = React.useState(false);
    const [inviteEmailError, setInviteEmailError] = React.useState(false);
    const [inviteEmailHelperText, setInviteEmailHelperText] = React.useState('');
    const [successMessage, setSuccessMessage] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');

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
        } else {
            db.collection('boards').doc(props.board.id).update(
                {
                    label: name,
                    description: description
                }
            ).then(result => {
                const emailText = 'Board name changed to "' + name + '" and description changed to "' + description + '"';
                db.collection('boards').doc(props.board.id).collection('history').add(
                    {
                        user: user.email,
                        name: name,
                        description: description,
                        action: 1,
                        timestamp: new Date(),
                        actionText: emailText
                    }
                ).catch(err => {
                    console.log("Error logging board update: " + err);
                });
                dispatchUserNotifications(props.board, user, emailText, {
                    user: user.email,
                    userIsOwner: props.board.owner === user.email,
                    action: 1,
                    timestamp: new Date(),
                    board: props.board.label,
                    boardId: props.board.id,
                    name: name,
                    description: description,
                    unread: true
                });
            }).catch(err => {
                setErrorSnackbar(true);
                setErrorMessage('There was an error saving board details!')
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
                    let permissionsCopy = {...props.board.permissions};
                    permissionsCopy[email] = { isAdmin: false };
                    db.collection('boards').doc(props.board.id).update({
                        userRefs: [...props.board.userRefs, email],
                        permissions: permissionsCopy
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
                const emailText = email + ' invited to the board';
                db.collection('boards').doc(props.board.id).collection('history').add(
                    {
                        user: user.email,
                        user2: email,
                        action: 2,
                        timestamp: new Date(),
                        actionText: emailText
                    }
                ).catch(err => {
                    console.log("Error logging inviting user: " + err);
                });
                dispatchUserNotifications(props.board, user, emailText, {
                    user: user.email,
                    userIsOwner: props.board.owner === user.email,
                    action: 2,
                    timestamp: new Date(),
                    board: props.board.label,
                    boardId: props.board.id,
                    user2: email,
                    unread: true
                }, email);
            }).catch(err => {
                console.log(err);
            });
        }
    };

    const deleteUser = (email) => {
        db.collection('boards').doc(props.board.id).update({
            userRefs: props.board.userRefs.filter(userEmail => userEmail !== email)
        }).then(result => {
            setSuccessSnackbar(true);
            setSuccessMessage('Successfully removed ' + email + '!');

            const emailText = email + ' removed from the board';
            db.collection('boards').doc(props.board.id).collection('history').add(
                {
                    user: user.email,
                    user2: email,
                    action: 3,
                    timestamp: new Date(),
                    actionText: emailText
                }
            ).catch(err => {
                console.log("Error logging removing user: " + err);
            });
            dispatchUserNotifications(props.board, user, emailText, {
                user: user.email,
                userIsOwner: props.board.owner === user.email,
                action: 3,
                timestamp: new Date(),
                board: props.board.label,
                boardId: props.board.id,
                user2: email,
                unread: true
            });
        }).catch(err => {
            console.log(err);
        });
    };

    const handlePermissionsChange = (event, email) => {
        const newValue = event.target.value === 'administrator' ? true : false;
        let permissionsCopy = {...props.board.permissions};
        permissionsCopy[email].isAdmin = newValue;
        db.collection('boards').doc(props.board.id).update({
            permissions: permissionsCopy
        }).then(result => {
            const emailText = 'Permissions for ' + email + ' changed to ' + (newValue ? 'administrator' : 'collaborator');
            db.collection('boards').doc(props.board.id).collection('history').add(
                {
                    user: user.email,
                    user2: email,
                    newPermission: newValue,
                    action: 12,
                    timestamp: new Date(),
                    actionText: emailText
                }
            ).catch(err => {
                console.log("Error logging changing permisisons: " + err);
            });
            dispatchUserNotifications(props.board, user, emailText, {
                user: user.email,
                userIsOwner: props.board.owner === user.email,
                action: 12,
                timestamp: new Date(),
                board: props.board.label,
                boardId: props.board.id,
                user2: email,
                newValue: newValue,
                unread: true
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
        setErrorMessage('');
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

    const handlePoints = (event, email) => {
        clearState();
        if (event.target.value < 0) {
            setErrorSnackbar(true);
            setErrorMessage('A users points cannot be negative!')
        } else {
            addPointsToUser(props.board.id, email, parseInt(event.target.value), true)
        }
    }

    const generateAPI = () => {
        const generateAPI = firebase.functions().httpsCallable('generateAPI');

        generateAPI({boardId: props.board.id}).then(result => {
           console.log(result)
           props.board.apiKey = result.data
        });
    }   

    const deleteAPI = () => {
        if (props.board.apiKey != null) {
            const deleteAPI = firebase.functions().httpsCallable('deleteAPI');
            deleteAPI({boardId: props.board.id}).then(result => {
                console.log(result)
             });
        }
    }

    const testGetTasks = () => {
        const key = document.getElementById('tasksAPI').value;
        const deleteAPI = firebase.functions().httpsCallable('getBoardTasks');
        deleteAPI({boardId: props.board.id, apiKey: key}).then(result => {
            console.log(result.data)
        });
    }

    const testGetHistory = () => {
        const key = document.getElementById('historyAPI').value;
        const deleteAPI = firebase.functions().httpsCallable('getBoardHistory');
        deleteAPI({boardId: props.board.id, apiKey: key}).then(result => {
            console.log(result.data)
        });
    }

    return (
        <div className={classes.settingsBody}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Board details</h2>
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
                                        <TableCell>Email</TableCell>
                                        <TableCell align='right'>Role</TableCell>
                                        <TableCell align='right'>Points</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            {props.board && (
                                                <Chip label={props.board.owner} color='primary' className={classes.chip} />
                                            )}
                                        </TableCell>
                                        <TableCell align='right'>
                                            <FormControl disabled>
                                                <Select value='owner'>
                                                    <MenuItem value='collaborator'>Collaborator</MenuItem>
                                                    <MenuItem value='administrator'>Administrator</MenuItem>
                                                    <MenuItem value='owner'>Owner</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                        <TableCell align='right'>
                                            <TextField type="number" value={props.points ? props.points[props.board.owner]: 0} onChange={(e) => handlePoints(e, props.board.owner)} />
                                        </TableCell>
                                    </TableRow>
                                    {props.board && props.board.userRefs && <React.Fragment>
                                        {props.board.userRefs.filter(userEmail => userEmail !== props.board.owner).map(userEmail => (
                                            <TableRow>
                                                <TableCell>
                                                    <Chip label={userEmail} color='primary' key={userEmail} className={classes.chip} variant='outlined' onDelete={() => deleteUser(userEmail)} />
                                                </TableCell>
                                                <TableCell align='right'>
                                                    <FormControl disabled={user.email === props.board.owner ? '' : 'disabled'}>
                                                        <Select value={props.board.permissions[userEmail].isAdmin === true ? 'administrator' : 'collaborator'} onChange={(e) => handlePermissionsChange(e, userEmail)}>
                                                            <MenuItem value='collaborator'>Collaborator</MenuItem>
                                                            <MenuItem value='administrator'>Administrator</MenuItem>
                                                        </Select>
                                                    </FormControl>
                                                </TableCell>
                                                <TableCell align='right'>
                                                    <TextField type="number" value={props.points && props.points[userEmail] ? props.points[userEmail] : 0} onChange={(e) => handlePoints(e, userEmail)} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </React.Fragment>}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {props.board && props.board.owner === user.email && (
                            <Typography variant='body2' component='p' style={{marginTop: 15 + 'px', width: 80 + '%', marginRight: 'auto', marginLeft: 'auto'}}>
                                As the board owner, you have full permissions for the board. Administrators are able to to access settings, and can do everything except change the roles of other users,
                                delete the board, and transfer board ownership. Collaborators have no access to the board settings.
                                <br /><br />
                                Roles take affect as soon as they are changed.
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper}>
                <Grid container spacing={3} style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Grid item xs={12}>
                        <h2>Board API</h2>
                    </Grid>
                    <Grid item xs={12} style={{textAlign: 'left'}}>
                    <Divider />
                        <Grid container spacing={0} className={classes.apiCard} >
                            <Grid item xs={12} sm container>
                                <Grid item container direction="column" spacing={2}>
                                    <Typography variant='subtitle1' className={classes.typography}>
                                        This boards API key
                                    </Typography>
                                    <Typography variant="body2">
                                        {props.board.apiKey ? props.board.apiKey : "No API key"}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Button variant='contained' color='primary' style={{marginRight: 5}} onClick={generateAPI}>Generate</Button>
                            <Button variant='contained' color='primary' onClick={deleteAPI}>Delete</Button>
                        </Grid>
                        <Divider />
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paper}>
                <Grid container spacing={3} style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Grid item xs={12}>
                        <h2>External API hooks</h2>
                    </Grid>
                    <Grid item xs={12} style={{textAlign: 'left'}}>
                    <Divider />
                        <Grid container spacing={0} className={classes.settingsCard} onClick={() => history.push('/board/' + props.board.id + '/api/settings')}>
                            <Grid item xs={12} sm container>
                                <Grid item container direction="column" spacing={2}>
                                    <Typography variant='subtitle1' className={classes.typography}>
                                        Edit API calls
                                    </Typography>
                                    <Typography variant="body2">
                                        Add, edit, or remove an automatic API call
                                    </Typography>
                                </Grid>
                            </Grid>
                            <ChevronRightIcon />
                        </Grid>
                        <Divider />
                        <Grid container spacing={0} className={classes.settingsCard} onClick={() => history.push('/board/' + props.board.id + '/api/history')}>
                            <Grid item xs={12} sm container>
                                <Grid item container direction="column" spacing={2}>
                                    <Typography variant='subtitle1' className={classes.typography}>
                                        View API call history
                                    </Typography>
                                    <Typography variant="body2">
                                        View the results of previous API calls
                                    </Typography>
                                </Grid>
                            </Grid>
                            <ChevronRightIcon />
                        </Grid>
                        <Divider />
                    </Grid>
                </Grid>
            </Paper>
            {props.board && props.board.owner === user.email && (
                <Paper className={classes.paper}>
                    <Grid container spacing={3} style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                        <Grid item xs={12}>
                            <h2>Here be dragons</h2>
                        </Grid>
                        <Grid item xs={12} style={{textAlign: 'left'}}>
                            <Divider />
                            <Grid container spacing={0} className={classes.settingsCard}>
                                <Grid item xs={12} sm container>
                                    <Grid item container direction="column" spacing={2}>
                                        <Typography variant='subtitle1' className={classes.typography}>
                                            Delete board
                                        </Typography>
                                        <Typography variant="body2" color='error'>
                                            Permanently delete the board
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <DeleteBoardDialog board={props.board} />
                            </Grid>
                            <Divider />
                            <Grid container spacing={0} className={classes.settingsCard}>
                                <Grid item xs={12} sm container>
                                    <Grid item container direction="column" spacing={2}>
                                        <Typography variant='subtitle1' className={classes.typography}>
                                            Transfer board ownership
                                        </Typography>
                                        <Typography variant="body2" color='error'>
                                            Transfer ownership of the board to an administrator of the board
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <TransferBoardDialog board={props.board} />
                            </Grid>
                            <Divider />
                        </Grid>
                    </Grid>
                </Paper>
            )}
            <Paper className={classes.paper}>
                <Grid container spacing={3} style={{width: '80%', marginLeft: 'auto', marginRight: 'auto'}}>
                    <Grid item xs={12}>
                        <h2>Test Public Facing API (FOR DEMO ONLY)</h2>
                    </Grid>
                    <Grid item xs={12} style={{textAlign: 'left'}}>
                    <Divider />
                        <Grid container spacing={0} className={classes.apiCard} >
                            <Grid item xs={12} sm container>
                                <Grid item container direction="column" spacing={2}>
                                    <Typography variant='subtitle1' className={classes.typography}>
                                        Get board tasks
                                    </Typography>
                                    <TextField id="tasksAPI" size='small' defaultValue="" ></TextField>
                                </Grid>
                            </Grid>
                            <Button variant='contained' color='primary' onClick={testGetTasks}>Test</Button>
                        </Grid>
                        <Divider />
                        <Grid container spacing={0} className={classes.apiCard} >
                            <Grid item xs={12} sm container>
                                <Grid item container direction="column" spacing={2}>
                                    <Typography variant='subtitle1' className={classes.typography}>
                                        Get board history
                                    </Typography>
                                    <TextField id="historyAPI" size='small' ></TextField>
                                </Grid>
                            </Grid>
                            <Button variant='contained' color='primary' onClick={testGetHistory}>Test</Button>
                        </Grid>
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
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default BoardSettings;