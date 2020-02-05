import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import NavBar from '../NavBar';
import ResetPasswordDialog from '../ResetPasswordDialog';

const useStyles = makeStyles(theme => ({
    loginBody: {
        margin: 20,
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

function Login(props) {
    const classes = useStyles();
    return (
        <div className={classes.loginBody}>
            <Grid container justify="center" xs={12}>
                <Grid container spacing={3} xs={4}>
                    <Grid item xs={12}>
                        <Paper className={classes.paper}>
                            <h2>Welcome to Managemit</h2>
                            <p>Keep track of your tasks and work collaboratively. Log in or register to get started.</p>
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
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
                                    {/* <Button variant='contained' className={classes.button} onClick={loginWithGoogle} >Log in with Google</Button> */}
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