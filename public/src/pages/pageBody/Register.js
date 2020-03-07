import React from 'react';
import getStyles from '../../styling/getStyles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar'
import TextField from '@material-ui/core/TextField';

import { auth } from '../../Firebase.js';


function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function Register(props) {
    const classes = getStyles();

    const regexp = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const uppercase = new RegExp('(?=.*[A-Z])');
    const numeric = new RegExp('(?=.*[0-9])');
    const special = new RegExp('(?=.[!@#$%^&])');
    const [firstPasswordError, setFirstPasswordError] = React.useState(false);
    const [firstPasswordHelperText, setFirstPasswordHelperText] = React.useState('');
    const [secondPasswordError, setSecondPasswordError] = React.useState(false);
    const [secondPasswordHelperText, setSecondPasswordHelperText] = React.useState('');
    const [emailError, setEmailError] = React.useState(false);
    const [emailHelperText, setEmailHelperText] = React.useState('');
    const [errorSnackbar, setErrorSnackbar] = React.useState(false);
    const [successSnackbar, setSuccessSnackbar] = React.useState(false);
    const [passwordStrength, setPasswordStrength] = React.useState(0);

    const signUpUser = (email, password, repassword) => {
        clearState();
        if (email === '') {
            setEmailError(true);
            setEmailHelperText('Email is required');
        } else if (!regexp.test(email)) {
            setEmailError(true);
            setEmailHelperText('Email must be properly formatted');
        } else if (password.length < 6) {
            setFirstPasswordError(true);
            setFirstPasswordHelperText('Password must be greater 6 characters long')
        } else if (password.length > 128) {
            setFirstPasswordError(true);
            setFirstPasswordHelperText('Password cannot be greater than 128 characters long')
        } else if (password !== repassword) {
            setFirstPasswordError(true);
            setFirstPasswordHelperText('Passwords must match')
            setSecondPasswordError(true);
            setSecondPasswordHelperText('Passwords must match')
        } else {
            auth.createUserWithEmailAndPassword(email, password).then(result => {
                const user = result.user;
                user.updateProfile({
                    displayName: document.getElementById('name').value
                }).then(res =>  {
                    setSuccessSnackbar(true);
                }).catch(error => {
                    console.log(error);
                });
            }).catch(error => {
                console.log(error);
                if (error.code === 'auth/email-already-in-use') {
                    setEmailError(true);
                    setEmailHelperText('Email already in use - have you already registered an account?');
                } else {
                    setErrorSnackbar(true);                
                }
            });
        }
    };

    const evaluatePasswordStrength = () => {
        const password = document.getElementById('password').value;
        setPasswordStrength(scorePassword(password));
        // TODO: Coloring and text
    }
    const scorePassword = (password) => {
        setPasswordStrength(0);
        let score = 0;
        if (password.length > 6) {
            score += 15;
        }
        if (password.length > 12) {
            score += 20;
        }
        if (uppercase.test(password)) {
            score += 20;
        }
        if (numeric.test(password)) {
            score += 20;
        }
        if (special.test(password)) {
            score += 25;
        }
        return score;
    }

    const clearState = () => {
        setFirstPasswordError(false);
        setFirstPasswordHelperText('');
        setSecondPasswordError(false);
        setSecondPasswordHelperText('');
        setEmailError(false);
        setEmailHelperText('');
        setSuccessSnackbar(false);
        setErrorSnackbar(false);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorSnackbar(false);
        setSuccessSnackbar(false);
    };

    return (    
        <div className={classes.loginBody}>
            <Grid container justify='center' xs={12}>
                <Grid container spacing={3} xs={4}>
                    <Grid item xs={12}>
                        <Paper className={classes.loginPaper}>
                            <h2>Welcome to Managemit</h2>
                            <p>
                                Keep track of your tasks and work collaboratively. Log in or
                                register to get started.
                            </p>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper className={classes.loginPaper}>
                            <h2>Register</h2>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        error={emailError}
                                        helperText={emailHelperText}
                                        label='Name'
                                        type='text'
                                        variant='outlined'
                                        id='name'
                                        className={classes.loginTextField}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        error={emailError}
                                        helperText={emailHelperText}
                                        label='Email'
                                        type='email'
                                        variant='outlined'
                                        id='email'
                                        className={classes.loginTextField}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        onChange={evaluatePasswordStrength.bind()}
                                        error={firstPasswordError}
                                        helperText={firstPasswordHelperText}
                                        label='Password'
                                        type='password'
                                        variant='outlined'
                                        id='password'
                                        className={classes.loginTextField}
                                    />
                                    <LinearProgress 
                                        className={classes.passwordStrengthBar}
                                        variant="determinate" 
                                        value={passwordStrength} 
                                        color='primary' 
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        error={secondPasswordError}
                                        helperText={secondPasswordHelperText}
                                        label='Re-enter password'
                                        type='password'
                                        variant='outlined'
                                        id='repassword'
                                        className={classes.loginTextField}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        variant='contained'
                                        color='primary'
                                        className={classes.loginButton}
                                        onClick={() =>
                                            signUpUser(
                                                document.getElementById('email').value,
                                                document.getElementById('password').value,
                                                document.getElementById('repassword').value
                                            )
                                        }
                                    >
                                        Register
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Snackbar open={successSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='success'>
                    Account successfully created!
                </Alert>
            </Snackbar>
            <Snackbar open={errorSnackbar} onClose={handleClose}>
                <Alert onClose={handleClose} autoHideDuration={6000} severity='success'>
                    There was an error creating an account!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default Register;