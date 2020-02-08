import React from "react";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar"
import MuiAlert from '@material-ui/lab/Alert';

import firebase, { auth, provider } from "../Firebase.js";

import getStyles from "../styling/getStyles";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Register(props) {
  const classes = getStyles();

  const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const [firstPasswordError, setFirstPasswordError] = React.useState(false);
  const [firstPasswordHelperText, setFirstPasswordHelperText] = React.useState('');
  const [secondPasswordError, setSecondPasswordError] = React.useState(false);
  const [secondPasswordHelperText, setSecondPasswordHelperText] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailHelperText, setEmailHelperText] = React.useState('');
  const [errorSnackbar, setErrorSnackbar] = React.useState(false);
  const [successSnackbar, setSuccessSnackbar] = React.useState(false);

  const signUpUser = (email, password, repassword) => {
    clearState();
    if (!regexp.test(email)) {
      setEmailError(true);
      setEmailHelperText('Email must be properly formatted');
    } else if (password.length < 6) {
      setFirstPasswordError(true);
      setFirstPasswordHelperText('Password must be greater 6 characters long')
    } else if (password !== repassword) {
      setFirstPasswordError(true);
      setFirstPasswordHelperText('Passwords must match')
      setSecondPasswordError(true);
      setSecondPasswordHelperText('Passwords must match')
    } else {
      auth.createUserWithEmailAndPassword(email, password).then(result => {
        setSuccessSnackbar(true);
      }).catch(error => {
        console.log(error);
        if (error.code === 'auth/email-already-in-use') {
          setErrorSnackbar(true);
        }
      });
    }
  };

  const clearState = () => {
    setFirstPasswordError(false);
    setFirstPasswordHelperText('');
    setSecondPasswordError(false);
    setSecondPasswordHelperText('');
    setEmailError(false);
    setEmailHelperText('');
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setErrorSnackbar(false);
    setSuccessSnackbar(false);
  }

  return (  
    <div className={classes.loginBody}>
      <Grid container justify="center" xs={12}>
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
                    label="Email"
                    type="email"
                    variant="outlined"
                    id="email"
                    className={classes.loginTextField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={firstPasswordError}
                    helperText={firstPasswordHelperText}
                    label="Password"
                    type="password"
                    variant="outlined"
                    id="password"
                    className={classes.loginTextField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={secondPasswordError}
                    helperText={secondPasswordHelperText}
                    label="Re-enter password"
                    type="password"
                    variant="outlined"
                    id="repassword"
                    className={classes.loginTextField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.loginButton}
                    onClick={() =>
                      signUpUser(
                        document.getElementById("email").value,
                        document.getElementById("password").value,
                        document.getElementById("repassword").value
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
      <Snackbar open={errorSnackbar} onClose={handleClose}>
        <Alert onClose={handleClose} autoHideDuration={6000} severity="error">
          An account with this email already exists
        </Alert>
      </Snackbar>
      <Snackbar open={successSnackbar} onClose={handleClose}>
        <Alert onClose={handleClose} autoHideDuration={6000} severity="success">
          Success!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Register;
