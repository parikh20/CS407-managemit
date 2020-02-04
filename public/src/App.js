import React from 'react';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import './App.css';

import NavBar from './NavBar.js';

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
            <NavBar />
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
                                    <TextField label="Email" variant="outlined" className={classes.textField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Password" variant="outlined" type="password" className={classes.textField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" className={classes.button}>Log in</Button>
                                    <Button variant="contained" className={classes.button}>Log in with Google</Button>
                                </Grid>
                                <Grid item xs={12}>
                                    <Button>Forgot password?</Button>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper className={classes.loginPaper}>

                            <h2>Register</h2>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField label="Email" variant="outlined" className={classes.textField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Password" type="password" variant="outlined" className={classes.textField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField label="Re-enter password" type="password" variant="outlined" className={classes.textField} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button variant="contained" color="primary" className={classes.button}>Register</Button>
                                </Grid>
                            </Grid>

                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}

export default App;
