import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const useStyles = makeStyles(theme => ({
    settingsBody: {
        flexGrow: 1,
        padding: 20,
        paddingRight: 200,
        paddingLeft: 200
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginBottom: 20
    },
    button: {
        marginRight: 5,
        marginLeft: 5
    },
    textField: {
        width: 80 + '%'
    },
    chip: {
        marginRight: 5,
        marginLeft: 5
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

    let defaultDate = new Date();
    if (typeof props.month === 'string' && typeof props.day === 'string' &&  typeof props.year === 'string') {
        defaultDate = new Date(props.year, props.month, props.day);
    }

    return (
        <div className={classes.settingsBody}>
            <Paper className={classes.paper}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <h2>Calendar</h2>
                        <Calendar
                            localizer={localizer}
                            startAccessor='start'
                            events={props.taskRefs ? buildEvents(props.taskRefs) : []}
                            endAccessor='end'
                            defaultDate={defaultDate}
                            style={{ height: 700 }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}

export default BoardCalendarComponent;