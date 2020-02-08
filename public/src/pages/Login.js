import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ResetPasswordDialog from '../ResetPasswordDialog';
import { Link } from 'react-router-dom';

import getStyles from '../styling/getStyles';

import { auth, provider } from '../Firebase.js'

function Login(props) {
    const classes = getStyles();

    const signInWithEmailAndPassword = (email, password) => {
        auth.signInWithEmailAndPassword(email, password).then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        });
    }

    const loginWithGoogle = () => {
        auth.signInWithPopup(provider).then(result => {
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <div className={classes.loginBody}>
            <Grid container justify="center" xs={12}>
                <Grid container spacing={3} xs={4}>
                    <Grid item xs={12}>
                        <Paper className={classes.loginPaper}>
                            <h2>Welcome to Managemit</h2>
                            <p>Keep track of your tasks and work collaboratively. Log in or register to get started.</p>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.loginPaper}>
                            <h2>Log in</h2>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField id='email' label='Email' type='email' variant='outlined' className={classes.loginTextField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id='password' label='Password' variant='outlined' type='password' className={classes.loginTextField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant='contained' color='primary' className={classes.loginButton} onClick={() => signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value)}>Log in</Button>
                                    <Button variant='contained' className={classes.loginButton} onClick={loginWithGoogle()}>Log in with Google</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Link to='/register'><Button variant='contained' color='primary' className={classes.loginButton}>Register a new account</Button></Link>
                                </Grid>
                                <Grid item xs={12}>
                                    <ResetPasswordDialog />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Login;