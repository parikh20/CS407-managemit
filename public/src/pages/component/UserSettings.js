import '../../App.css';
import React from 'react';

import AddPhotoDialog from './AddPhotoDialog';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import MuiAlert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import {Typography } from '@material-ui/core';
import ArrowIcon from '@material-ui/icons/ArrowForwardIos';

import firebase from '../../Firebase';
import { db, auth } from '../../Firebase';
import EditNameDialog from './EditNameDialog';
import EditPhoneNumberDialog from './EditPhoneNumberDialog';

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles(theme => ({
    userSettingsBody: {
        flexGrow: 1,
        padding: 20,
        paddingRight: 200,
        paddingLeft: 200
    },
    paper: {
        textAlign: 'left',
    },
    settingsCard: {
        cursor: 'pointer',
        padding: theme.spacing(2.5),
        '&:hover': {
            background: "#D3D3D3",
        }
    },
    header: {
        padding: theme.spacing(2)
    }
}));

function UserSettings(props) {
    const classes = useStyles();

    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <div className={classes.userSettingsBody}>
            <Paper className={classes.paper} >
                <Typography variant='h5' className={classes.header}>Change your account details</Typography>
                < AddPhotoDialog />
                < EditNameDialog />
                <EditPhoneNumberDialog />
                <Grid container spacing={0} className={classes.settingsCard} >
                    <Grid item xs={12} sm container>
                        <Grid item container direction="column" spacing={2} >
                            <Typography variant='subtitle1'>
                                Change Email
                            </Typography>
                            <Typography variant="body2">
                                Change your email address
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item style={{marginTop: 10}}>
                        <ArrowIcon></ArrowIcon>
                    </Grid>
                </Grid>
                <Divider />
                <Grid container spacing={0} className={classes.settingsCard} >
                    <Grid item xs={12} sm container>
                        <Grid item container direction="column" spacing={2} >
                            <Typography variant='subtitle1'>
                                Change Password
                            </Typography>
                            <Typography variant="body2">
                                Change your password
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item style={{marginTop: 10}}>
                        <ArrowIcon></ArrowIcon>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default UserSettings;