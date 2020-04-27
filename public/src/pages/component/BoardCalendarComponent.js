import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const primaryDark = "#222831"
const secondaryDark = "#30476E"
const darkTextColor = "#c1a57b"
const black = "#000"
const white = "#fff"

const useStyles = makeStyles(theme => ({
    darkSettingsBody: {
        flexGrow: 1,
        padding: 20,
        paddingRight: 200,
        paddingLeft: 200,
        color: darkTextColor,
        backgroundColor: secondaryDark,
    },
    whiteSettingsBody: {
        flexGrow: 1,
        padding: 20,
        paddingRight: 200,
        paddingLeft: 200,
        color: black,
        backgroundColor: white,
    },
    darkPaper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: darkTextColor,
        backgroundColor: secondaryDark,
        marginBottom: 20
    },
    whitePaper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: black,
        backgroundColor: white,
        marginBottom: 20
    },
    darkButton: {
        marginRight: 5,
        marginLeft: 5,
        color: darkTextColor,
        backgroundColor: secondaryDark,
    },
    whiteButton: {
        marginRight: 5,
        marginLeft: 5,
        color: black,
        backgroundColor: white,
    },
    darkTextField: {
        width: 80 + '%',
        color: darkTextColor,
        backgroundColor: secondaryDark,
    },
    whiteTextField: {
        width: 80 + '%',
        color: black,
        backgroundColor: white,
    },
    darkChip: {
        marginRight: 5,
        marginLeft: 5,
        color: darkTextColor,
        backgroundColor: secondaryDark,
    },
    whiteChip: {
        marginRight: 5,
        marginLeft: 5,
        color: black,
        backgroundColor: white,
    },
    darkCalendar: {
        height: 700,
        color: darkTextColor,
        backgroundColor: secondaryDark,
    },
    whiteCalendar: {
        height: 700,
        color: black,
        backgroundColor: white,
    }
}));

const buildEvents = taskRefs => {
    return taskRefs.filter(taskRef => taskRef.data().date !== null).map(taskRef => {
        let data = taskRef.data();
        return {
            id: taskRef.id,
            title: data.title,
            allDay: true,
            start: data.date.toDate(),
            end: data.date.toDate()
        };
    });
};

function BoardCalendarComponent(props) {
    const classes = useStyles();
    const mode = props.darkMode

    let defaultDate = new Date();
    if (typeof props.month === 'string' && typeof props.day === 'string' &&  typeof props.year === 'string') {
        defaultDate = new Date(props.year, props.month, props.day);
    }

    return (
        <div className={classes[`${mode}SettingsBody`]}>
            <Paper className={classes[`${mode}Paper`]}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Calendar</h2>
                        <Calendar
                            localizer={localizer}
                            startAccessor='start'
                            events={props.taskRefs ? buildEvents(props.taskRefs) : []}
                            endAccessor='end'
                            defaultDate={defaultDate}
                            className={classes[`${mode}Calendar`]}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default BoardCalendarComponent;