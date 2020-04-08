import '../../App.css';
import React from 'react';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

import dateFormat from 'dateformat';

import AddPhotoDialog from './AddPhotoDialog';
import EditNameDialog from './EditNameDialog';
import EditEmailDialog from './EditEmailDialog';
import EditPasswordDialog from './EditPasswordDialog';
import DeleteAccountDialog from './DeleteAccountDialog';

import { db } from '../../Firebase';

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

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function UserSettingsComponent(props) {
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('user'));

    const [errorText, setErrorText] = React.useState('');
    const [errorSnackbar, setErrorSnackbar] = React.useState(false);

    const handleChange = name => event => {
        db.collection('users').doc(user.email).set(
            {[name]: event.target.checked},
            {merge: true}
        ).then(res => {
        }).catch(err => {
            console.log(err);
        })
    };

    const handleVacationModeToggle = event => {
        let updateObj = {
            vacationMode: event.target.checked
        };
        if (!event.target.checked) {
            updateObj.vacationModeEndDate = null;
        }
        db.collection('users').doc(user.email).update(updateObj);
    };

    const handleVacationModeDateChange = event => {
        clearState();

        let date = event.target.valueAsDate;
        if (date !== null) {
            date = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date !== null && date < today) {
            setErrorSnackbar(true);
            setErrorText('Date cannot be in the past');
            return;
        }

        db.collection('users').doc(user.email).update({
            vacationModeEndDate: date
        });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorSnackbar(false);
    };

    const clearState = () => {
        setErrorSnackbar(false);
        setErrorText('');
    }

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

                <Grid container spacing={0} className={classes.settingsCard} >
                    <Grid item xs={12} sm container>
                        <Grid item container direction="column" spacing={2} >
                            <Typography variant='subtitle1'>
                                Vacation mode
                            </Typography>
                            <Typography variant="body2">
                                Toggle vacation mode - this overrides other notification settings
                            </Typography>
                        </Grid>
                    </Grid>
                    <Switch checked={props.settings.vacationMode || false} onChange={handleVacationModeToggle} color="primary" />   
                </Grid>

                {props.settings.vacationMode && (
                    <Grid container spacing={0} className={classes.settingsCard} >
                        <Grid item xs={12} sm container>
                            <Grid item container direction="column" spacing={2} >
                                <Typography variant='subtitle1'>
                                    Vacation mode end date
                                </Typography>
                                <Typography variant="body2">
                                    Set the end date for vacation mode
                                </Typography>
                            </Grid>
                        </Grid>
                        <TextField
                            type='date'
                            defaultValue={props.settings.vacationModeEndDate ? dateFormat(props.settings.vacationModeEndDate.toDate(), 'yyyy-mm-dd') : ''}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleVacationModeDateChange}
                        />  
                    </Grid>
                )}

                <Divider />
            </Paper>

            <DeleteAccountDialog boards={props.boards} />

            <Snackbar open={errorSnackbar} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} autoHideDuration={6000} severity='error'>
                    {errorText}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default UserSettingsComponent;