import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import Link from '@material-ui/core/Link';

import '../../App.css';

import DeleteBoardDialog from './DeleteBoardDialog.js';
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
    }
}));

function BoardSettings(props) {
    const classes = useStyles();

    const user = JSON.parse(localStorage.getItem('user'));
    const db = firebase.firestore();

    const [nameError, setNameError] = React.useState(false);
    const [nameHelperText, setNameHelperText] = React.useState('');
    const [descriptionError, setDescriptionError] = React.useState(false);
    const [descriptionHelperText, setDescriptionHelperText] = React.useState('');
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const [errorSnackbar, setErrorSnackbar] = React.useState(false);

    const handleSettingsSubmit = () => {
        clearState();
        if (!props.board) {
            return; // sanity check
        }
        const name = document.getElementById('boardName').value.trim();
        const description = document.getElementById('boardDescription').value.trim();

        if (name === '') {
            setNameError(true);
            setNameHelperText('Name cannot be empty!');
        } else if (description === '') {
            setDescriptionError(true);
            setDescriptionHelperText("Description cannot be empty!");
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
            setSuccessSnackbar(true);
        }

    };

    function clearState() {
        setNameError(false);
        setNameHelperText('');
        setDescriptionError(false);
        setDescriptionHelperText('');
        setSuccessSnackbar(false);
        setErrorSnackbar(false);
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
                        <TextField label='Add a user by email address' type='email' variant='outlined' className={classes.textField} style={{width: 70 + '%'}}/>
                        <Button variant='contained' color='primary' style={{height: 100 + '%', width: 10 + '%'}}>Add user</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Chip label='John Doe' color='primary' className={classes.chip} />
                        <Chip label='Joe User' color='primary' className={classes.chip} />
                        <Chip label='John Doe' color='primary' className={classes.chip} />
                        <Chip label='Joe User' color='primary' className={classes.chip} />
                        <Chip label='John Doe' color='primary' className={classes.chip} />
                        <Chip label='Joe User' color='primary' className={classes.chip} />
                        <Chip label='John Doe' color='primary' className={classes.chip} />
                        <Chip label='Joe User' color='primary' className={classes.chip} />
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
                <Link href='/boards' color='inherit'>
                    <Alert onClose={handleClose} autoHideDuration={6000} severity='success'>
                        Successfully saved board details!
                    </Alert>
                </Link>
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