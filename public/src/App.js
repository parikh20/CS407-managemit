import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import './App.css';

import NavBar from './NavBar.js';
import ResetPasswordDialog from './ResetPasswordDialog.js';

// test imports - not actually needed on this page
import ColumnGroup from './ColumnGroup.js';
import BoardsActions from './BoardsActions.js';
import BoardActions from './BoardActions.js';
import BoardCardCollection from './BoardCardCollection.js';


// Firebase imports
import firebase, { auth, provider } from './Firebase.js'

function loginWithGoogle() {
    auth.signInWithPopup(provider).then(function(result) {
        var user = result.user;
        console.log(user);
        // ...
      }).catch(function(error) {
        console.log(error);
      });
      
}

const useStyles = makeStyles(theme => ({
    loginBody: {
        flexGrow: 1,
        padding: 20,
        paddingRight: 200,
        paddingLeft: 200
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    loginPaper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        height: 100 + '%' // Keeps the boxes at the same height
    },
    button: {
        marginRight: 5,
        marginLeft: 5
    },
    textField: {
        width: 80 + '%'
    }
}));

function App() {
    const classes = useStyles();

    return (
        <div>
            <NavBar onLandingPage='true' />
            <div className={classes.loginBody}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <h2>Welcome to Managemit</h2>
                            <p>Keep track of your tasks and work collaboratively. Log in or register to get started.</p>
                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.loginPaper}>

                            <h2>Log in</h2>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField label='Email' type='email' variant='outlined' className={classes.textField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label='Password' variant='outlined' type='password' className={classes.textField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant='contained' color='primary' className={classes.button}>Log in</Button>
                                    <Button variant='contained' className={classes.button} onClick={loginWithGoogle} >Log in with Google</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <ResetPasswordDialog />
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.loginPaper}>

                            <h2>Register</h2>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField label='Email' type='email' variant='outlined' className={classes.textField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label='Password' type='password' variant='outlined' className={classes.textField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label='Re-enter password' type='password' variant='outlined' className={classes.textField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant='contained' color='primary' className={classes.button}>Register</Button>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                </Grid>
            </div>

            <div>
                <br /><br /><br /><br />everything here and below is a testing area<br /><br /><br /><br />
                <p>nav bar: variant for boards page</p>
                <NavBar />
                <BoardsActions />
                <BoardCardCollection />
                <p>nav bar: variant for individual board page</p>
                <NavBar onBoardPage='true' />
                <BoardActions/>
                <ColumnGroup />
            </div>
        </div>
    );
}

export default App;
