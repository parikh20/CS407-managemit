import React from 'react';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import getStyles from '../styling/getStyles';

function Register(props) {
    const classes = getStyles();
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
                             <h2>Register</h2>
                             <Grid container spacing={3}>
                                 <Grid item xs={12}>
                                     <TextField label='Email' type='email' variant='outlined' className={classes.loginTextField} />
                                 </Grid>
                                 <Grid item xs={12}>
                                     <TextField label='Password' type='password' variant='outlined' className={classes.loginTextField} />
                                 </Grid>
                                 <Grid item xs={12}>
                                     <TextField label='Re-enter password' type='password' variant='outlined' className={classes.loginTextField} />
                                 </Grid>
                                 <Grid item xs={12}>
                                     <Button variant='contained' color='primary' className={classes.loginButton}>Register</Button>
                                 </Grid>
                             </Grid>
                         </Paper>
                     </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default Register;