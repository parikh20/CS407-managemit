import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

import '../../App.css';

import DeleteBoardDialog from './DeleteBoardDialog.js';
import firebase from '../../Firebase';

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

// TODO: Should be refined
// Potentially put a button on the card
const user = JSON.parse(localStorage.getItem('user'));
function saveBoardSettings(props) {
    const db = firebase.firestore();
    let id = window.location.href;
    id = id.substring(28, 48)
    db.collection('boards').doc(id).update(
        {
            label: document.getElementById('boardName').value,
            description: document.getElementById('boardDescription').value
        }
    ).catch(err => {
        console.log(err);
    });
}

function BoardSettings(props) {
    const classes = useStyles();

    return (
        <div className={classes.settingsBody}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Board Details</h2>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id='boardName' label='Name' variant='outlined' className={classes.textField} InputLabelProps={{shrink: true}} defaultValue={props.board.label} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField id='boardDescription' label='Description' variant='outlined' className={classes.textField} multiline rows={5} InputLabelProps={{shrink: true}} value={props.board.description} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant='contained' color='primary' onClick={saveBoardSettings}>Save changes</Button>
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
        </div>
    );
}

export default BoardSettings;