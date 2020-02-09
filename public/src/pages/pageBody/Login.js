import React from 'react';
import { useHistory } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar'
import ResetPasswordDialog from '../component/ResetPasswordDialog';
import { Link } from 'react-router-dom';

import getStyles from '../../styling/getStyles';

import { auth, provider } from '../../Firebase.js'

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function Login(props) {
    const classes = getStyles();
    const history = useHistory();

    const regexp = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [loginEmailError, setLoginEmailError] = React.useState(false);
    const [loginEmailErrorHelperText, setLoginEmailErrorHelperText] = React.useState('');
    const [loginPasswordError, setLoginPasswordError] = React.useState(false);
    const [loginPasswordErrorHelperText, setLoginPasswordErrorHelperText] = React.useState('');
    const [loginErrorSnackbar, setloginErrorSnackbar] = React.useState(false);

    const signInWithEmailAndPassword = (email, password) => {
        clearState();
        if (!regexp.test(email)) {
            setLoginEmailErrorHelperText('Email must be properly formatted');
            setLoginEmailError(true);
        } else if (password.length < 6) {
            setLoginPasswordErrorHelperText('Password must be greater than 6 characters long');
            setLoginPasswordError(true);
        } else {
            auth.signInWithEmailAndPassword(email, password).then(result => {
                localStorage.setItem('user', JSON.stringify(result.user));
                history.push('/boards');
            }).catch(error => {
                console.log(error);
                setloginErrorSnackbar(true);
            });
        }
    }

    const loginWithGoogle = () => {
        auth.signInWithPopup(provider).then(result => {
            localStorage.setItem('user', JSON.stringify(result.user));
            history.push('/boards');
        }).catch(error => {
            console.log(error);
        });
    };

    const clearState = () => {
        setLoginEmailError(false);
        setLoginEmailErrorHelperText('');
        setLoginPasswordError(false);
        setLoginPasswordErrorHelperText('');
        setloginErrorSnackbar(false);
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setloginErrorSnackbar(false);
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
                                    <TextField id='email' error={loginEmailError} helperText={loginEmailErrorHelperText} label='Email' type='email' variant='outlined' className={classes.loginTextField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField id='password' error={loginPasswordError} helperText={loginPasswordErrorHelperText} label='Password' variant='outlined' type='password' className={classes.loginTextField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant='contained' color='primary' className={classes.loginButton} onClick={() => signInWithEmailAndPassword(document.getElementById("email").value, document.getElementById("password").value)}>Log in</Button>
                                    <Button variant='contained' className={classes.loginButton} onClick={loginWithGoogle}>Log in with Google</Button>
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
            <Snackbar open={loginErrorSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='error'>
                    The email and/or password is incorrect. Please try again
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Login;