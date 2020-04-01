import '../../App.css';
import React from 'react';

import AddPhotoDialog from './AddPhotoDialog';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import {Typography, Button } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';

import { db } from '../../Firebase';
import EditNameDialog from './EditNameDialog';
import EditEmailDialog from './EditEmailDialog';
import EditPasswordDialog from './EditPasswordDialog';

const useStyles = makeStyles(theme => ({
    userSettingsBody: {
        flexGrow: 1,
        padding: 20,
        paddingRight: 200,
        paddingLeft: 200
    },
    paper: {
        textAlign: 'left',
        marginTop: 20
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

function UserSettingsComponent(props) {
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleChange = name => event => {
        db.collection('users').doc(user.uid).set(
            {[name]: event.target.checked},
            {merge: true}
        ).then(res => {

        }).catch(err => {
            console.log(err);
        })
    };

    return (
        <div className={classes.userSettingsBody}>
            <Paper className={classes.paper} >
                <Typography variant='h5' className={classes.header}>Change Your Account Details</Typography>
                <AddPhotoDialog />
                <EditNameDialog />
                { user.providerData[0].providerId === 'password' &&
                        <div>
                            <EditEmailDialog />
                            <EditPasswordDialog />
                        </div>
                    }
            </Paper>

            <Paper className={classes.paper} >
                <Typography variant='h5' className={classes.header}>Display Settings</Typography>
                <Divider />
                <Grid container spacing={0} className={classes.settingsCard} >
                    <Grid item xs={12} sm container>
                        <Grid item container direction="column" spacing={2} >
                            <Typography variant='subtitle1'>
                                Dark mode
                            </Typography>
                            <Typography variant="body2">
                                Toggle dark mode
                            </Typography>
                        </Grid>
                    </Grid>
                    <Switch checked={props.settings.darkMode || false} onChange={handleChange('darkMode')} color="primary" />
                </Grid>
            <Divider />
            </Paper>

            <Paper className={classes.paper} >
                <Typography variant='h5' className={classes.header}>Notification Settings</Typography>
                <Divider />
                <Grid container spacing={0} className={classes.settingsCard} >
                    <Grid item xs={12} sm container>
                        <Grid item container direction="column" spacing={2} >
                            <Typography variant='subtitle1'>
                                Email notifications
                            </Typography>
                            <Typography variant="body2">
                                Toggle email notifications
                            </Typography>
                        </Grid>
                    </Grid>
                    <Switch checked={props.settings.emailNotifications || false} onChange={handleChange('emailNotifications')} color="primary" />   
                </Grid>

                <Grid container spacing={0} className={classes.settingsCard} >
                    <Grid item xs={12} sm container>
                        <Grid item container direction="column" spacing={2} >
                            <Typography variant='subtitle1'>
                                In app notifications
                            </Typography>
                            <Typography variant="body2">
                                Toggle in app notifications
                            </Typography>
                        </Grid>
                    </Grid>
                    <Switch checked={props.settings.inAppNotifications || false} onChange={handleChange('inAppNotifications')} color="primary" />   
                </Grid>
            <Divider />
            </Paper>

            <Paper className={classes.paper} >
                <Typography variant='h5' className={classes.header}>Delete Account</Typography>
                <Divider />
                <Grid container spacing={0} className={classes.settingsCard} >
                    <Grid item xs={12} sm container>
                        <Grid item container direction="column" spacing={2} >
                            <Typography variant='subtitle1'>
                                Delete Your Account
                            </Typography>
                            <Typography color='error' variant="body2">
                                Warning! This action is permanent
                            </Typography>
                        </Grid>
                    </Grid>
                    <Button variant='contained' color='secondary' >Delete</Button>
                </Grid>
            <Divider />
            </Paper>
        </div>
    );
}

export default UserSettingsComponent;